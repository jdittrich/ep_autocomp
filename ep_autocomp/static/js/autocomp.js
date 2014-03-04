var underscore = require('ep_etherpad-lite/static/js/underscore');
var $ = require('ep_etherpad-lite/static/js/rjquery').$; //it rjquery is a bridge in order to make jquery require-able


/*
This must be changed as we want to disable calling the plugin, not showing something. 

$('#taglistButton').click(function(){
  $('#taglist').toggle();
});
*/

var $autocomp, $list;

var autocomp = {
	//the following shoould probably be: isActive(true) for enabling, isActive (false) for disabling, isActive() for getting the current state. (closure!)
	isEnabled: true,//this could be getter/Setter too
	isShown: false,
	enable: function(){ //show suggenstions
		
	},

	disable: function(){//hide suggestions
		
	},
	
	showAutocomp:function(){
		
	


	},
	createAutocompHTML:function(filteredSuggestions,cursorPosition){
	/*
	creates the dom element for the menu.

	gets:
	filteredSuggestions: an array containing objects like
		{
			fullText: string containing the full text, e.g. "nightingale"
			complementaryString: string with what is needed to complete the String to be matched e.g is the string to be matches is "nighti", than the complementary String here would be "ngale"
		}
	cursorPosition: an getBoundingClientRect() with the properties top and left in pixel.

	returns: ?
	*/
		if(!filteredSuggestions||!cursorPosition){
			console.log("insufficent attributes");
			return;} //precaution
		if(filteredSuggestions.length===0){
			$autocomp.hide();
		}
		//remove menu
		if(!$autocomp) {
			var $outerdocbody = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
			$autocomp = $('<div id="autocomp" style="position: absolute;display: none;z-index: 10;"><div id="autocompItems"></div></div>');
			$list = $autocomp.find('#autocompItems');
			$outerdocbody.append($autocomp);
		}
		
		$list.empty();
		
		console.log(cursorPosition.top, cursorPosition.left);
		
		//CREATE DOM ELEMENTS
		var listEntries = [];
		$.each(filteredSuggestions, function(index,suggestion){
			// create a dom element (li) for each suggestion
			listEntries.push(
				$("<li/>",{
					"class":"ep_autocomp-listentry", //TODO: move this to a config object
					"text":suggestion.fullText
				}).data(
					"complementary",filteredSuggestions.complementaryString //give the complementary string along.
				)//end $
			); //end push
		}); //end each-function
		

		$list.append(listEntries); //...append all list entries holding the suggestions
		//appendTo($('iframe[name="ace_outer"]').contents().find('#outerdocbody'));//append to dom //remove this
		
		$autocomp
			.show()
			.css({top: cursorPosition.top, left: cursorPosition.left})
	},
	hideAutocomp:function(){},
	aceKeyEvent: function(type, context, cb){
		//if not menu not shown, dont prevent defaults
		
		//if key is ↑ , choose next option, prevent default
		//if key is ↓ , choose next option, prevent default
		//if key is ENTER, read out the complementation, close autocomplete menu and input it at cursor. It will reopen tough, if there is still something to complete. No problem, on a " " or any other non completable character and it is gone again. 
		
		
		
		
		if(context.evt.which===89 && autocomp.isEnabled===true)
		{
			var curEl = context.rep.lines.atIndex(context.rep.selEnd[0]).lineNode;

			//$(curEl).sendkeys('he ho I pressed Y!');

			autocomp.isEnabled = false;
			window.setTimeout(function(){autocomp.isEnabled=true; console.log("reenabled");},1000);
			context.evt.preventDefault();
			return true; // returnvalue should be true if the event was handled. So we return a true which can be returned by the hook itself consequently. A bit FUD here. 
		}
	},
	aceEditEvent:function(type, context, cb){ 
		autocomp.update(type, context, cb);
	},
	update:function(type, context, cb){
		//remove from here into checkForAutocomp or so. Usecase: use ←↓↑→ to navigate the code will not cause edit events. 
		if(context.rep.selStart === null){return;}
		if(autocomp.isEditByMe(context)!==true){return;} //as edit event is called when anyone edits, we must ensure it is the current user
		
		var sectionMarker= /[\S]*$/; //what is the  section to be considered? Usually, this will be everything which is not a space. The Regex includes the $ (end of line) so we can find the section of interest beginning form the strings end. (To understand better, just paste into regexpal.com) 
		var afterSectionMarker = /^$|^\s/ ; //what is the section after the caret in order to allow autocompletion? Usually we don’t want to start autocompletion directly in a word, so we restrict it to either whitepsace \s or to an empty string, ^$. Not this applies the the string after the caret (hence the start of string at the beginning, ^)
		
		var caretPosition = context.rep.selEnd; //TODO: must it be the same as selStart to be viable? FUD-test on equivalence?
		var currentLine = context.rep.lines.atIndex(caretPosition[0]); //gets infos about the line the caret is in 
		var textBeforeCaret = currentLine.text.slice(0,caretPosition[1]); //from beginning until caret
		//var charAfterCaret = currentLine.text.charAt(caretPosition[1]); //returns the character after the caret
		var relevantSection = textBeforeCaret.match(sectionMarker)[0]; 
		
		
		if(!(relevantSection.length>0)){ //return if either the string in front or the string after the caret are not suitable. 
			return;
		}
		
		suggestions = autocomp.getPossibleSuggestions();
		filteredSuggestions = autocomp.filterSuggestionList(relevantSection, suggestions); 
		
		var cursorPosition = autocomp.cursorPosition(context);
		autocomp.createAutocompHTML(filteredSuggestions,cursorPosition);
	},
	filterSuggestionList:function(relevantSection,possibleSuggestions){
		/*
		gets: 
		- the string for which we want matches ("relevantSection")
		- a list of all completions
		
		returns: an array with objects containing suggestions as object with
		{
			fullText: string containing the full text, e.g. "nightingale"
			complementaryString: string with what is needed to complete the String to be matched e.g is the string to be matches is "nighti", than the complementary String here would be "ngale"
		}
		

		*/
		
		//filter it
		var filteredSuggestions=[];
		underscore.each(possibleSuggestions,function(possibleSuggestion, key, list){
			if(typeof possibleSuggestion !=="string"){return;} //precaution
			if(possibleSuggestion.indexOf(relevantSection)===0){ //indexOf === 0 means, in the possibleSuggestion is the (whole) relevant section and it starts at the begin of the possibleSuggestion 
				var complementaryString = possibleSuggestion.slice(relevantSection.length)
				filteredSuggestions.push({
				"fullText":possibleSuggestion, 
				"complementaryString":complementaryString});
			}
		});
		
		var filteredSuggestionsSorted= underscore.sortBy(filteredSuggestions,function(suggestion){ //sort it (if the list remains static, this could be done only once
			return suggestion.fullText; //sort suggestions by the fullText attribute
		});
		
		console.log(relevantSection,filteredSuggestionsSorted);
		return filteredSuggestionsSorted;
	},
	cursorPosition:function(context){
		/*
		gets: context object from a ace editor event (e.g. aceEditEvent)
		returns: x and y value for the position of the cursor measured in pixel.

		useful to know:
		The structure inside the editor is usually:
		div
		|_ span
		|_ span
		|_ span

		div
		|- span
		etc.: Many divs (equal paragraphs) with spans inside (equal formated sections) So there are few spans if few formating took place, many spans if a lot ofdifferent bold, colored etc. text is there.

		In this function, we will determine the div the cursor is in and clone that div and its style. Than, in the clone, we find  the corresponding subnode the cursor is in, than the offset in the corresponding text node the cursor is in.
		Than we insert a span exactly there and get its position.
		Than we clean up again, cause this is messy stuff.
		*/

		var innerEditorPosition= $('iframe[name="ace_outer"]').contents().find('#outerdocbody').find('iframe[name="ace_inner"]')[0].getBoundingClientRect(); //move this out for performace reasons, rarely changes. 
		var caretPosition = context.rep.selEnd; //get caret position as array, [0] is y, [1] is x; 
		var nodeToFind = $(context.rep.lines.atIndex(caretPosition[0]).domInfo.node); //determine the node the cursor is in
		var clone = nodeToFind.clone(); //clone the node the cursor is in
		var computedCSS= window.getComputedStyle(nodeToFind[0]); //get the "real" css styles.
		var p = nodeToFind.position(); //get the source nodes position
		clone.attr("id","tempPosId");//change the id…
		clone.css({ //apply the styles (todo: do it for subnodes as well
			"position":"absolute",
			width:computedCSS.width,
			heigth:computedCSS.height,
			margin:computedCSS.margin,
			padding:computedCSS.padding,
			fontSize:computedCSS.fontSize,
			lineHeight:computedCSS.lineHeight,
			top:p.top+innerEditorPosition.top+"px" ,
			left:p.left+innerEditorPosition.left+"px",
			background:"transparent",
			color:"transparent"
		})
		clone.appendTo($('iframe[name="ace_outer"]').contents().find('#outerdocbody')); //do not append it in the inner editor (messes with ace), put it in the outer one.

		//now we want to find the subnode (some span) it is in. 
		var counter=0; //holds the added length of text of all subnodes parsed. 
		var targetNode=null; //the subnode our cursor is in.
		clone.children().each(function(index,element){
			counter = counter+$(element).text().length;
			if(counter>=context.rep.selEnd[1]){ //if the added text length is grater than the cursors position.
				targetNode = element;//… we found the subnode we wanted. 
				return false; //stop jquery each by returning false
			}
		});
		
		if (!targetNode){ //this happens usually if you are in a headline e.g.
			console.log("no target node found");
			return;
		}
		var leftoverString = $(targetNode).text().length - (counter-context.rep.selEnd[1]); //how many characters are between the start of the element and the cursor?
		var targetNodeText = targetNode.childNodes[0] || "";//get the text of the subnode our cursor is in. FIX: I sometimes get a targetNo

		var span = document.createElement("span"); //create a helper span
		span.appendChild(document.createTextNode('X'));//…and give it a content.

		if(targetNodeText.length>2){//if there is text long enough to insert something in between…
			targetNode.insertBefore(span, targetNodeText.splitText(leftoverString));
		}else{//otherwise, just insert without the split.
			targetNode.insertBefore(span,targetNodeText)
		}
		var position = $(span).offset();
		var scrollYPos= $('iframe[name="ace_outer"]').contents().scrollTop();
		clone.remove(); //clean up again.

		return {
			top: (position.top + scrollYPos), //so offset gives me the ofset to the root document (not the iframe) so after scrolling down, top becomes less or even negative. So add the offset to get back where it belongs.
			left:position.left
		};
	},
	getParam: function(sname)
	{
	/*
	for getting URL parameters
	sname is the requested key
	returned is the keys value

	so if you have http://www.someurl.end?foo=bar
	it will return "bar" if you give it "foo"
	*/
	var temp;
	var params = location.search.substr(location.search.indexOf("?")+1); //"?" devides the actual URL from the parameters
	var sval = "";
	params = params.split("&"); //"&" devides the kex/value pairs

	for (var i=0; i<params.length; i++)// split param and value into individual pieces
	{
	temp = params[i].split("=");
	if ( [temp[0]] == sname ) { sval = temp[1]; }
	}
	return sval;
	},
	isEditByMe:function(context){
		/*
		determines if the edit is done on the authors client or by a collaborator
		gets: context-objects
		returns: boolean. true (edit is done by author), false (edit done by someone else)
		*/
		if (!context||!context.callstack){return}
		if (context.callstack.editEvent.eventType==="idleWorkTimer"){ //this is the only way I found to determine if an edit is caused by input from the current user or from a collaborator
			return true
		}else{
			return false;
		}
	},
	getPossibleSuggestions:function(){
		return ["a", "ab", "abc", "abcd", "b", "bc", "bcd", "bcde"];
	}
	
};

