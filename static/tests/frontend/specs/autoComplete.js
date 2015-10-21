describe("show autocomplete suggestions", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      enableAutocomplete(true, function(){
        writeWordsWithC(cb);
      });
    });
    this.timeout(60000);
  });


  it("displays suggestions", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestionsPopup = outer$('div#autocomp');
      expect(suggestionsPopup.find('li').length).to.be(3);

      done();
    });
  })

  it("hides suggestions", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // first make sure suggestions are displayed
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // then check if suggestions are hidden if there are no words that match
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('notSavedWord');
      helper.waitFor(function(){
        return !outer$('div#autocomp').is(":visible");
      }).done(done);
    });
  })

  it("applies selected suggestion", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      pressEnter();
      helper.waitFor(function(){
        var $lastLine =  inner$("div").last();
        return $lastLine.text() === "car";
      }).done(done);
    });
  })

  context("when there is line attributes applied", function(){

    it("ignores * in the beginning of line", function(done){
      addAttributeToLine(0, function(){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;
        var $lastLine =  inner$("div").last();
        $lastLine.sendkeys('c');
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          pressEnter();
          helper.waitFor(function(){
            var $lastLine =  inner$("div").last();
            return $lastLine.text() === "car";
          }).done(done);
        });
      });
    })

  })

  context("when event processing is disabled", function(){
    it("does not show suggestions", function(done){
      var outer$ = helper.padOuter$;
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.processEvent = false;
      var inner$ = helper.padInner$;
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('c');
      //we have to give enough time to suggestions box be shown
      setTimeout(function() {
        expect(outer$('div#autocomp').is(":visible")).to.be(false);
        done();
      }, 500);
    })
  })

  context("when user types in a line with line attributes", function(){

    it("ignores * in the beginning of line", function(done){
      getLine(3).sendkeys("c");
      addAttributeToLine(3, function(){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;
        var $lastLine =  inner$("div").last();

        //using contents was the only way we found to set content of a list item
        $lastLine.find("ul li").contents().sendkeys('a');
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          pressEnter();
          helper.waitFor(function(){
            var $lastLine =  inner$("div").last();
            return $lastLine.text() === "car";
          }).done(done);
        });
      });
    })

  })
})

/* ********** Helper functions ********** */

function pressEnter(){
  var inner$ = helper.padInner$;
  if(inner$(window)[0].bowser.firefox || inner$(window)[0].bowser.modernIE){ // if it's a mozilla or IE
    var evtType = "keypress";
  }else{
    var evtType = "keydown";
  }
  var e = inner$.Event(evtType);
  e.which = 13; // enter :|
  inner$("#innerdocbody").trigger(e);
}

function pressListButton(){
  var chrome$ = helper.padChrome$;
  var $insertunorderedlistButton = chrome$(".buttonicon-insertunorderedlist");
  $insertunorderedlistButton.click();
}

function addAttributeToLine(lineNum, cb){
  var inner$ = helper.padInner$;
  var $targetLine = getLine(lineNum);
  $targetLine.sendkeys('{mark}');
  pressListButton();
  helper.waitFor(function(){
    var $targetLine = getLine(lineNum);
    return $targetLine.find("ul li").length === 1;
  }).done(cb);
}

// first line === getLine(0)
// second line === getLine(1)
// ...
var getLine = function(lineNum){
  var inner$ = helper.padInner$;
  var line = inner$("div").first();
  for (var i = lineNum - 1; i >= 0; i--) {
    line = line.next();
  }
  return line;
}