test(
  'ObjEachTest',

  [
    'ephox.katamari.api.Obj',
    'ephox.wrap-jsverify.Jsc'
  ],

  function (Obj, Jsc) {
    var check = function (expected, input) {
      var values = [];
      Obj.each(input, function (x, i) {
        values.push({index: i, value: x});
      });
      assert.eq(expected, values);
    };

    check([], {});
    check([{index: 'a', value: 'A'}], {a: 'A'});
    check([{index: 'a', value: 'A'}, {index: 'b', value: 'B'}, {index: 'c', value: 'C'}], {a: 'A', b: 'B', c: 'C'});

    Jsc.property(
      'Each + set should equal the same object',
      Jsc.dict(Jsc.json),
      function (obj) {
        var values = { };
        var output = Obj.each(obj, function (x, i) {
          values[i] = x;
        });
        return Jsc.eq(obj, values) && Jsc.eq(undefined, output);
      }
    );
  }
);
