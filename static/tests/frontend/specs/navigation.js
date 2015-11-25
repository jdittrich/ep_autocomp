describe("ep_autocomp - commands auto complete", function(){
  //create a new pad before each test run
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

  it("moves selection to second suggestion", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // opens suggestions box
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function() {
      // force autocomplete to move selection down
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.moveSelectionDown();

      var selectedSuggestion = outer$('div#autocomp li.selected');
      expect(selectedSuggestion.text()).to.be("chrome");
      done();
    });
  });

  it("moves selection to a position above", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // opens suggestions box
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function() {
      // force autocomplete to move selection to last option
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.moveSelectionDown();
      autocomp.moveSelectionDown();

      // force autocomplete to move selection one position up
      autocomp.moveSelectionUp();

      var selectedSuggestion = outer$('div#autocomp li.selected');
      expect(selectedSuggestion.text()).to.be("chrome");
      done();
    });
  });

  it("selects suggestion", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    // opens suggestions box
    var $lastLine = inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function() {
      var $lastLine = inner$('div').last();
      var context = ep_autocomp_test_helper.utils.mockContext($lastLine);

      // force autocomplete to select first option
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.selectSuggestion(context);

      helper.waitFor(function(){
        var $lastLine =  inner$("div").last();
        return $lastLine.text() === "car";
      }).done(done);
    });
  });

  it("closes suggestions box without replacing the text", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    // opens suggestions box
    var $lastLine = inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function() {
      // force autocomplete to close suggestions box
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.closeSuggestionBox();

      helper.waitFor(function(){
        return !outer$('div#autocomp').is(":visible");
      }).done(function(){
        var $lastLine =  inner$("div").last();
        expect($lastLine.text()).to.be("c");
        done();
      });
    });
  });
});

var ep_autocomp_test_helper = ep_autocomp_test_helper || {};
