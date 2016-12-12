test(
  'ContainsTest',

  [
    'ephox.katamari.api.Arr',
    'ephox.wrap-jsverify.Jsc'
  ],

  function (Arr, Jsc) {
    var check = function (expected, input, value) {
      assert.eq(expected, Arr.contains(input, value));
    };

    check(false, [], 1);
    check(true, [1], 1);
    check(false, [1], 2);
    check(true, [2, 4, 6], 2);
    check(true, [2, 4, 6], 4);
    check(true, [2, 4, 6], 6);
    check(false, [2, 4, 6], 3);

    var genArrayWithSplit = Jsc.nearray(Jsc.json).generator.flatMap(function (arr) {
      return Jsc.integer(0, arr.length).generator.map(function (slicePt) {
        return {
          arr: arr,
          slicePt: slicePt
        };
      });
    });

    var arbArrayWithSplit = Jsc.bless({
      generator: genArrayWithSplit
    });

    Jsc.property(
      'An element added to an array must be contained within it',
      arbArrayWithSplit,
      Jsc.json,
      function (arb, value) {
        var arr = arb.arr.slice(0, arb.slicePt).concat([ value ]).concat(arb.arr.slice(arb.slicePt));
        return Arr.contains(arr, value);
      }
    );

    Jsc.property(
      'An array should not contain anything which has been removed via a filter',
      arbArrayWithSplit,
      Jsc.json,
      function (arb, value) {
        var filtered = Arr.filter(arb.arr, function (item) {
          return item !== value;
        });
        return !Arr.contains(filtered, value);
      }
    );

    Jsc.property(
      'An empty array should contain nothing',
      Jsc.json,
      function (value) {
        return !Arr.contains([ ], value);
      }
    );
  }
);
