describe("ep_autocomp - plugin customization - when flag to show suggestions for Latin characters is turned on", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      ep_autocomp_test_helper.utils.clearPad(function() {
        ep_autocomp_test_helper.utils.resetFlagsAndEnableAutocomplete(function(){
          // enable flag to consider Latin chars as regular chars
          var autocomp = helper.padChrome$.window.autocomp;
          autocomp.ignoreLatinCharacters = true;

          // ignore case just to make tests easier -- so we don't need to create the double
          // of test scenarios
          autocomp.caseSensitiveMatch = false;

          cb();
        });
      });
    });
    this.timeout(60000);
  });

  it("shows suggestions for 'á', 'à', 'ä', 'ã', 'â', 'Á', 'À', 'Ä', 'Ã', 'Â'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dá dà dä dã dâ dÁ dÀ dÄ dÃ dÂ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('da');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dá");
      expect(suggestions).to.contain("dà");
      expect(suggestions).to.contain("dä");
      expect(suggestions).to.contain("dã");
      expect(suggestions).to.contain("dâ");
      expect(suggestions).to.contain("dÁ");
      expect(suggestions).to.contain("dÀ");
      expect(suggestions).to.contain("dÄ");
      expect(suggestions).to.contain("dÃ");
      expect(suggestions).to.contain("dÂ");
      done();
    });
  });

  it("shows suggestions for 'é', 'è', 'ë', 'ê', 'É', 'È', 'Ë', 'Ê'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dé dè dë dê dÉ dÈ dË dÊ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('de');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dé");
      expect(suggestions).to.contain("dè");
      expect(suggestions).to.contain("dë");
      expect(suggestions).to.contain("dê");
      expect(suggestions).to.contain("dÉ");
      expect(suggestions).to.contain("dÈ");
      expect(suggestions).to.contain("dË");
      expect(suggestions).to.contain("dÊ");
      done();
    });
  });

  it("shows suggestions for 'í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dí dì dï dî dÍ dÌ dÏ dÎ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('di');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dí");
      expect(suggestions).to.contain("dì");
      expect(suggestions).to.contain("dï");
      expect(suggestions).to.contain("dî");
      expect(suggestions).to.contain("dÍ");
      expect(suggestions).to.contain("dÌ");
      expect(suggestions).to.contain("dÏ");
      expect(suggestions).to.contain("dÎ");
      done();
    });
  });

  it("shows suggestions for 'ó', 'ò', 'ö', 'õ', 'ô', 'Ó', 'Ò', 'Ö', 'Õ', 'Ô'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dó dò dö dõ dô dÓ dÒ dÖ dÕ dÔ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('do');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dó");
      expect(suggestions).to.contain("dò");
      expect(suggestions).to.contain("dö");
      expect(suggestions).to.contain("dõ");
      expect(suggestions).to.contain("dô");
      expect(suggestions).to.contain("dÓ");
      expect(suggestions).to.contain("dÒ");
      expect(suggestions).to.contain("dÖ");
      expect(suggestions).to.contain("dÕ");
      expect(suggestions).to.contain("dÔ");
      done();
    });
  });

  it("shows suggestions for 'ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Ü', 'Û'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dú dù dü dû dÚ dÙ dÜ dÛ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('du');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dú");
      expect(suggestions).to.contain("dù");
      expect(suggestions).to.contain("dü");
      expect(suggestions).to.contain("dû");
      expect(suggestions).to.contain("dÚ");
      expect(suggestions).to.contain("dÙ");
      expect(suggestions).to.contain("dÜ");
      expect(suggestions).to.contain("dÛ");
      done();
    });
  });

  it("shows suggestions for 'ç', 'Ç'", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // write words with Latin characters, so they will be available on suggestions later
    // (all start with "d" so we can use this prefix to choose which suggestions to show)
    var $firstLine = inner$("div").first();
    $firstLine.sendkeys('dç dÇ ');

    // type first letters, so all words written above should be displayed
    $firstLine.sendkeys('dc');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
      expect(suggestions).to.contain("dç");
      expect(suggestions).to.contain("dÇ");
      done();
    });
  });

  context("when user did not type the beginning of suggestion using Latin chars", function() {
    beforeEach(function(cb) {
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // 1st line: words beginning with Latin characters
      // 2nd line: line like "ar<b>v muito</b> bonita"
      // (we need text with mixed formatting to be able to validate that text formatting was not broken)
      var $firstLine = inner$("div").first();
      $firstLine.html("árvore<br/>ar<b>v muito</b> bonita");

      // wait for Etherpad to finish splitting the lines
      helper.waitFor(function(){
        var $firstLine = inner$("div").first();
        return $firstLine.text() === "árvore";
      }).done(function(){
        // place caret on "arvo| muito (...)"
        var $lastLine = inner$("div").last();
        $lastLine.sendkeys("{rightarrow}{rightarrow}{rightarrow}o");

        // wait for suggestions to be available
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(cb);
      });
    });

    it("replaces the entire word respecting text formatting", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // select first suggestion ("árvore")
      ep_autocomp_test_helper.utils.pressEnter();

      // check if suggestion replaced text with Latin chars
      helper.waitFor(function(){
        var $lastLine = inner$("div").last();
        return $lastLine.text() === "árvore muito bonita";
      }).done(function() {
        // check if text formatting was respected
        // last line should be "ár<b>vore muito</b> bonita"
        var $lastLine = inner$("div").last();
        var textInBold = $lastLine.find("b").text();
        expect(textInBold).to.be("vore muito");

        done();
      });
    });
  });
});

/* ********** Helper functions ********** */
var ep_autocomp_test_helper = ep_autocomp_test_helper || {};