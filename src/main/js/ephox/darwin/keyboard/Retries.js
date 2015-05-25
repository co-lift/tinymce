define(
  'ephox.darwin.keyboard.Retries',

  [
    'ephox.darwin.keyboard.Carets',
    'ephox.darwin.keyboard.Rectangles',
    'ephox.darwin.util.Logger',
    'ephox.fussy.api.Point',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.dom.DomGather',
    'ephox.scullion.ADT',
    'global!Math'
  ],

  function (Carets, Rectangles, Logger, Point, Fun, Option, DomGather, Adt, Math) {
    var JUMP_SIZE = 5;
    /*
     * This isn't right ... but let's just hook it up first.
     */

    var adt = Adt.generate([
      { 'none' : [] },
      { 'retry': [ 'caret' ] },
      { 'adjusted': [ 'caret' ] }
    ]);

    var adjustDown = function (guessBox, original, caret) {
      // We haven't dropped vertically, so we need to look down and try again.
      if (Math.abs(guessBox.bottom() - original.bottom() < 1)) return adt.retry(Carets.moveDown(caret, JUMP_SIZE));
      // The returned guessBox based on the guess actually doesn't include the initial caret. So we search again
      // where we adjust the caret so that it is inside the returned guessBox. This means that the offset calculation
      // will be more accurate.
      else if (guessBox.top() > caret.bottom()) return adt.adjusted(Carets.moveBottomTo(caret, guessBox.top() + 1));
      else return adt.none();
    };

    var adjustUp = function (guessBox, original, caret) {
      console.log('guessBox', guessBox.top, 'caret.top', caret.top(), 'original', original.top());


      // We haven't ascended vertically, so we need to look up and try again.
      if (Math.abs(guessBox.top() - original.top()) < 1) return adt.retry(Carets.moveUp(caret, JUMP_SIZE));
      // The returned guessBox based on the guess actually doesn't include the initial caret. So we search again
      // where we adjust the caret so that it is inside the returned guessBox. This means that the offset calculation
      // will be more accurate.
      else if (guessBox.bottom() < caret.top()) return adt.adjusted(Carets.moveTopTo(caret, guessBox.bottom() - 1));


      else return adt.none();
    };

    var upMovement = {
      point: Carets.getTop,
      adjuster: adjustUp,
      move: Carets.moveUp,
      gather: DomGather.before
    };

    var downMovement = {
      point: Carets.getBottom,
      adjuster: adjustDown,
      move: Carets.moveDown,
      gather: DomGather.after
    };

    var adjustTil = function (win, direction, original, caret, counter) {
      if (counter === 0) return Option.some(caret);
      return Point.find(win, caret.left(), direction.point(caret)).bind(function (guess) {
        return guess.start().fold(Option.none, function (element, offset) {
          console.log('guess:' , element.dom(), offset);
          return Rectangles.getBox(win, element, offset).bind(function (guessBox) {
            console.log('*************************************', guessBox);
            return direction.adjuster(guessBox, original, caret).fold(Option.none, function (newCaret) {
              console.log('Hit target moving from: ', direction.point(caret), ' to ', direction.point(newCaret));
              return adjustTil(win, direction, original, newCaret, counter-1);
            }, function (newCaret) {
              console.log('Adjusted to: ', direction.point(newCaret));
              return Option.some(newCaret);
            });
          }).orThunk(function () {
            console.log('falling back to: ', direction.point(caret));
            return Option.some(caret);
          });
        }, Option.none);
      });
    };

    var ieTryDown = function (win, caret) {
      return Point.find(win, caret.left(), caret.bottom() + JUMP_SIZE);
    };

    var ieTryUp = function (win, caret) {
      return Point.find(win, caret.left(), caret.top() - JUMP_SIZE);
    };

    var retry = function (direction, win, caret) {
      console.log('caret: ', caret);
      console.log('Executing retry');
      console.log('start: ', direction.point(caret));
      var moved = direction.move(caret, JUMP_SIZE);
      console.log('moved: ', direction.point(moved));
      var adjusted = adjustTil(win, direction, caret, moved, 100).getOr(moved);
      console.log('adjusted: ', direction.point(adjusted));
      if (direction.point(adjusted) > win.innerHeight) {
        var delta = direction.point(adjusted) - (win.innerHeight + win.scrollY) + 10;
        win.scrollBy(0, delta);
        return Point.find(win, adjusted.left(), direction.point(adjusted) - delta);
      } else {
        console.log('not scrolling');
        return Point.find(win, adjusted.left(), direction.point(adjusted));
      }
    };

    return {
      tryUp: Fun.curry(retry, upMovement),
      tryDown: Fun.curry(retry, downMovement),
      ieTryUp: ieTryUp,
      ieTryDown: ieTryDown
    };
  }
);