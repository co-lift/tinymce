test('Intersperse',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Jam',
    'ephox.wrap-jsverify.Jsc'
  ],

  function(Arr, Jam, Jsc) {

    var check = function (expected, input, delimiter) {
      var actual = Jam.intersperse(input, delimiter);
      assert.eq(expected, actual);
    };

    var checkErr = function (expected, input, delimiter) {
      try {
        Jam.intersperse(input, delimiter);
        assert.fail('Excpected exception: ' + expected + ' from input: ' + input + ' with delimiter: ' + delimiter);
      } catch (e) {
        assert.eq(expected, e.message);
      }
    };

    check([], [], 2);
    check([1], [1], 2);
    check([1,2,1,2,1], [1,1,1], 2);
    check(['a', 3, 'a', 3, 'a'], ['a', 'a', 'a'], 3);
    check([[1], [4], [1]], [[1], [1]], [4]);
    checkErr('Cannot intersperse undefined', undefined, 2);

    Jsc.property(
      'Length of interspersed = len(arr) + len(arr)-1',
      Jsc.array(Jsc.json),
      Jsc.json,
      function (arr, delimiter) {
        var actual = Jam.intersperse(arr, delimiter);
        var expected = arr.length === 0 ? 0 : arr.length * 2 - 1;
        return Jsc.eq(expected, actual.length);
      }

    );

    Jsc.property(
      'Every odd element matches delimiter',
      Jsc.array(Jsc.json),
      Jsc.json,
      function (arr, delimiter) {
        var actual = Jam.intersperse(arr, delimiter);
        return Arr.forall(actual, function (x, i) {
          return i % 2 === 1 ? Jsc.eq(x, delimiter) : true;
        });
      }
    );

    Jsc.property(
      'Filtering out delimiters (assuming different type to array to avoid removing original array) should equal original',
      Jsc.array(Jsc.string),
      Jsc.nat,
      function (arr, delimiter) {
        var actual = Jam.intersperse(arr, delimiter);
        var filtered = Arr.filter(actual, function (a) {
          return a !== delimiter;
        });
        return Jsc.eq(arr, filtered);
      }
    );
  }
);