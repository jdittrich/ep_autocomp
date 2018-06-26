describe('ep_autocomp - position of autocomplete suggestions', function() {
  var utils, targetLineNumber, baseline;

  var getTargetLine = function() {
    return helper.padInner$('div:eq(' + targetLineNumber + ')');
  }

  var getDistanceBetweenTargetLineAndSuggestions = function() {
    var $suggestionsPopup = helper.padOuter$('div#autocomp');

    // create a temp element to get its position, then remove it
    var $endOfTargetLine = $('<span>x</span>');
    getTargetLine().append($endOfTargetLine);

    var top  = $suggestionsPopup.position().top  - $endOfTargetLine.position().top;
    var left = $suggestionsPopup.position().left - $endOfTargetLine.position().left;

    $endOfTargetLine.remove();

    return { top: top, left: left };
  }

  before(function(done) {
    utils = ep_autocomp_test_helper.utils;
    var test = this;

    helper.newPad(function() {
      utils.clearPad(function() {
        utils.resetFlagsAndEnableAutocomplete(function() {
          utils.writeWordsWithC(function() {
            // get baseline for tests
            var $targetLine = helper.padInner$('div').last();
            targetLineNumber = $targetLine.index();

            $targetLine.sendkeys('{selectall}');
            $targetLine.sendkeys('c');

            utils.waitShowSuggestions(test, function() {
              baseline = getDistanceBetweenTargetLineAndSuggestions();
              done();
            });
          });
        });
      });
    });

    this.timeout(60000);
  });

  context('when text is too long to fit on a single line', function() {
    before(function(done) {
      var test = this;

      var $targetLine = getTargetLine();
      $targetLine.sendkeys('{selectall}');
      $targetLine.sendkeys(' a'.repeat(250));

      utils.waitHideSuggestions(test, function() {
        // target line might be long enough now, we can type 'c' to show suggestions
        // further down the screen
        var $targetLine = getTargetLine();
        $targetLine.sendkeys(' c');

        utils.waitShowSuggestions(test, done);
      });
    });

    it('displays suggestions with the same distance to the caret position', function(done) {
      var distance = getDistanceBetweenTargetLineAndSuggestions();
      expect(distance.left).to.be(baseline.left);
      expect(distance.top).to.be(baseline.top);
      done();
    });

    // could be any text formatting, bold is just an example
    context('and part of the text before caret is bold', function() {
      before(function(done) {
        var $targetLine = getTargetLine();
        helper.selectLines($targetLine, $targetLine, 100, 200);
        var $boldButton = helper.padChrome$('.buttonicon-bold');
        $boldButton.click();

        // force suggestions to be shown again
        var $targetLine = getTargetLine();
        $targetLine.sendkeys('{selectall}{rightarrow}');
        $targetLine.sendkeys(' c');
        utils.waitShowSuggestions(this, done);
      });

      it('displays suggestions with the same distance to the caret position', function(done) {
        var distance = getDistanceBetweenTargetLineAndSuggestions();
        expect(distance.left).to.be(baseline.left);
        expect(distance.top).to.be(baseline.top);
        done();
      });
    });
  });
});
