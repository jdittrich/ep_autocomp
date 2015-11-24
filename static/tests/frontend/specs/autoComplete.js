describe("ep_autocomp - show autocomplete suggestions", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      ep_autocomp_test_helper.utils.clearPad(function() {
        ep_autocomp_test_helper.utils.resetFlagsAndEnableAutocomplete(function(){
          ep_autocomp_test_helper.utils.writeWordsWithC(cb);
        });
      });
    });
    this.timeout(60000);
  });


  it("displays suggestions when user types a word that matches others from the text", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestionsPopup = outer$('div#autocomp');
      expect(suggestionsPopup.find('li').length).to.be(3);

      done();
    });
  });

  it("hides suggestions when user types a word that does not match any other from the text", function(done){
    // this is a longer test, give it more time to run
    this.timeout(5000);

    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // first make sure suggestions are displayed
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // then check if suggestions are hidden if there are no words that match
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('notSavedWord');
      helper.waitFor(function(){
        return !outer$('div#autocomp').is(":visible");
      }, 2000).done(done);
    });
  });

  it("hides suggestions when user types ESC", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // first make sure suggestions are displayed
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // then press ESC
      ep_autocomp_test_helper.utils.pressEsc();

      helper.waitFor(function(){
        return !outer$('div#autocomp').is(":visible");
      }).done(done);
    });
  });

  it("applies selected suggestion when user presses ENTER", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      ep_autocomp_test_helper.utils.pressEnter();
      helper.waitFor(function(){
        var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
        return $lastLine.text() === "car";
      }).done(done);
    });
  });

  it("applies selected suggestion when clicks on it on the suggestion box", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // type something to show suggestions
    var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // click on last suggestion ("couch")
      var $suggestions = outer$('div#autocomp li');
      var $couchSuggestion = $suggestions.last();
      $couchSuggestion.click();

      // check if last suggestion was inserted
      helper.waitFor(function(){
        var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
        return $lastLine.text() === "couch";
      }).done(done);
    });
  });

  context("when there are line attributes applied", function(){
    beforeEach(function(cb) {
      // make line where "car" is a line with line attributes
      ep_autocomp_test_helper.utils.addAttributeToLine(0, cb);
    });

    it("ignores * in the beginning of line", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // type something to display suggestions
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        // select first suggestion (should be "car")
        ep_autocomp_test_helper.utils.pressEnter();

        // test if "car" was selected -- if it was not, it means the suggestion
        // was "*car", so "*" was not ignored
        helper.waitFor(function(){
          var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
          return $lastLine.text() === "car";
        }).done(done);
      });
    });
  });

  context("when current line has line attribute", function(){
    beforeEach(function(cb) {
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys("c");
      ep_autocomp_test_helper.utils.addAttributeToLine(3, cb);
    });

    it("ignores * in the beginning of line", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      //using contents was the only way we found to set content of a list item
      var $lastLine = inner$("div").last().find("ul li").contents();

      $lastLine.sendkeys('a');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("car");
        done();
      });
    });

    context("and there is already content after caret", function(){
      beforeEach(function() {
        var inner$ = helper.padInner$;

        // using contents was the only way we found to set content of a list item
        var $lastLine = inner$("div").last().find("ul li").contents();

        // add content after caret
        $lastLine.sendkeys('s{leftarrow}');
      });

      it("displays suggestions matching text before the caret", function(done){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;

        //using contents was the only way we found to set content of a list item
        var $lastLine = inner$("div").last().find("ul li").contents();

        // type "a" to have "ca" before caret, so suggestion list has "car"
        $lastLine.sendkeys('a');

        // suggestions should have "car"
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
          expect(suggestions).to.contain("car");
          done();
        });
      });

      context("and caret is on beginning of line", function() {
        beforeEach(function(cb) {
          // show suggestions for empty prefixes (so we can choose a suggestion when caret is
          // on beginning of line)
          var autocomp = helper.padChrome$.window.autocomp;
          autocomp.showOnEmptyWords = true;

          // move caret to beginning of line (line has "cs" at this point)
          var inner$ = helper.padInner$;
          var outer$ = helper.padOuter$;
          var $lastLine = inner$("div").last().find("ul li").contents();
          $lastLine.sendkeys('{leftarrow}');

          helper.waitFor(function(){
            return outer$('div#autocomp').is(":visible");
          }).done(cb);
        });

        it("keeps line attributes when suggestion is selected", function(done) {
          var inner$ = helper.padInner$;

          // select first suggestion (should be "car")
          ep_autocomp_test_helper.utils.pressEnter();

          // verify line attribute was kept on line
          var $lastLine = inner$("div").last().find("ul li");
          var hasLineAttribute = $lastLine.length > 0;
          expect(hasLineAttribute).to.be(true);

          // verify suggestion was correctly inserted
          expect($lastLine.text()).to.be("carcs");

          done();
        });
      });
    });
  });
});

/* ********** Helper functions ********** */
var ep_autocomp_test_helper = ep_autocomp_test_helper || {};
