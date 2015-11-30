describe("ep_autocomp - target line", function(){
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

  it("updates target line when suggestions box is opened", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var autocomp = helper.padChrome$.window.autocomp;
    var targetLine = 3;

    // opens suggestions box
    var $lastLine = ep_autocomp_test_helper.utils.getLine(targetLine);
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');

    // wait for targetLine to be updated
    helper.waitFor(function(){
      return autocomp.targetLine;
    }).done(function() {
      expect(autocomp.targetLine).to.be(targetLine);

      done();
    });
  });

  it("resets target line when no suggestion is available for typed text", function(done){
    this.timeout(5000);

    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var autocomp = helper.padChrome$.window.autocomp;

    // opens suggestions box
    var $lastLine = inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return autocomp.targetLine !== undefined;
    }).done(function() {
      // type something that won't have suggestions
      var $lastLine = inner$("div").last();
      $lastLine.sendkeys('ccc');

      // wait for targetLine to be updated
      helper.waitFor(function(){
        return autocomp.targetLine === undefined;
      }).done(done);
    });
  });

  context("when flag to not reset target on empty suggestion list is enabled", function() {
    beforeEach(function() {
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.doNotResetTargetLineOnEmptySuggestionList = true;
    });

    it("does not reset target line when no suggestion is available for typed text", function(done){
      this.timeout(5000);

      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;
      var autocomp = helper.padChrome$.window.autocomp;
      var targetLine = 3;

      // type something that won't have suggestions
      var $lastLine = inner$("div").last();
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('cccc');

      // wait for targetLine to be updated
      helper.waitFor(function(){
        return autocomp.targetLine !== undefined;
      }).done(function() {
        expect(autocomp.targetLine).to.be(targetLine);

        done();
      });
    });
  });

  it("resets target line when suggestion is selected", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var autocomp = helper.padChrome$.window.autocomp;

    // opens suggestions box
    var $lastLine = inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return autocomp.targetLine !== undefined;
    }).done(function() {
      var $lastLine = inner$('div').last();
      var context = ep_autocomp_test_helper.utils.mockContext($lastLine);

      // force autocomplete to select suggestion
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.selectSuggestion(context);

      // wait for targetLine to be updated
      helper.waitFor(function(){
        return autocomp.targetLine === undefined;
      }).done(done);
    });
  });

  it("resets target line when suggestions box is manually closed", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var autocomp = helper.padChrome$.window.autocomp;

    // opens suggestions box
    var $lastLine = inner$("div").last();
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return autocomp.targetLine !== undefined;
    }).done(function() {
      // force autocomplete to close suggestions box
      autocomp.closeSuggestionBox();

      // wait for targetLine to be updated
      helper.waitFor(function(){
        return autocomp.targetLine === undefined;
      }).done(done);
    });
  });
});

var ep_autocomp_test_helper = ep_autocomp_test_helper || {};
