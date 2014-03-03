var underscore = require('ep_etherpad-lite/static/js/underscore');
var $ = require('ep_etherpad-lite/static/js/rjquery').$; //it rjquery is a bridge in order to make jquery require-able


/*
This must be changed as we want to disable calling the plugin, not showing something. 

$('#taglistButton').click(function(){
  $('#taglist').toggle();
});
*/
var autocomp = {
	//the following shoould probably be: isActive(true) for enabling, isActive (false) for disabling, isActive() for getting the current state. (closure!)
	isEnabled: true,//this could be getter/Setter too
	enable: function(){ //show suggenstions
		
	},

	disable: function(){//hide suggestions
		
	},
	
	showAutocomp:function(){},
	hideAutocomp:function(){},
	
	
	aceKeyEvent: function(type, context, cb){
		//TODO: What is in the arguments?
		//find the current element
		
		
		if(context.evt.which===89 && autocomp.isEnabled===true)
		{
			var curEl = context.rep.lines.atIndex(context.rep.selEnd[0]).lineNode;

			$(curEl).sendkeys('he ho I pressed Y!');

			autocomp.isEnabled = false;
			window.setTimeout(function(){autocomp.isEnabled=true; console.log("reenabled")},1000);
			context.evt.preventDefault();
			return true; // returnvalue should be true if the event was handled. So we return a true which can be returned by the hook itself consequently. A bit FUD here. 
		}
	},
	
	aceEditEvent:function(type, context, cb){ 
		if(context.rep.selStart === null){return;} //if there is no cursor
		if(autocomp.eventCausedByMe(context)!==true){return;} //as edit event is called when anyone edits, we must ensure it is the current user
		
		var sectionMarker= /[\S]*$/; //what is the  section to be considered? Usually, this will be everything which is not a space. The Regex includes the $ (end of line) so we can find the section of interest beginning form the strings end. (To understand better, just paste into regexpal.com) 

		var caretPosition = context.rep.selEnd; //TODO: must it be the same as selStart to be viable? FUD-test on equivalence?
		var currentLine = context.rep.lines.atIndex(caretPosition[0]); //gets infos about the line the caret is in 
		var textBeforeCaret = currentLine.text.slice(0,caretPosition[1]);
		var relevantSection = textBeforeCaret.match(sectionMarker); 

		if (relevantSection.length>0){ //if there is a section in front of the cursor that should be autocompleted…
		} 
	},
	
	getParam: function(sname)
	{	/*
	for getting URL parameters
	sname is the requested key
	returned is the keys value

	so if you have http://www.someurl.end?foo=bar
	it will return "bar" if you give it "foo"
	*/
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
	eventCausedByMe:function(context){
	/*
	Determines if the edit action was done by the user (in contrast to another remote collaborator)
	
	gets: the edit Events context-object
	returns: true if the action is done by the user him/herself
	*/
			if(!(context&&context.callstack)){return} //just in case there was no object passed if there is no context object 
		
		if(context.callstack.editEvent.eventType==="idleWorkTimer") //this is rather hacky, but the only event property which was different between remote and own edits.
		{
			return true;
		}else{
			return false;
		}	
	}
	
	
};


