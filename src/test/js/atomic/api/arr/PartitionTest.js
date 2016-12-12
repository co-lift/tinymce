test(
  'Partition Test',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.wrap-jsverify.Jsc'
  ],

  function (Arr, Fun, Jsc) {

    (function() {

      var check = function (input, expected) {
        assert.eq(expected, Arr.partition(input, function (n) { return n.indexOf('yes') > -1; }));
      };

      check([], {pass: [], fail:[]});
      check(['yes'], {pass: ['yes'], fail:[]});
      check(['no'], {pass: [], fail:['no']});
      check(
        ['yes', 'no', 'no', 'yes'],
        {
          pass: ['yes', 'yes'], fail: ['no', 'no']
        }
      );

      check(
        ['no 1', 'no 2', 'yes 1', 'yes 2', 'yes 3', 'no 3', 'no 4', 'yes 4', 'no 5', 'yes 5'],
        {
          pass: ['yes 1', 'yes 2', 'yes 3', 'yes 4', 'yes 5'], fail: ['no 1', 'no 2', 'no 3', 'no 4', 'no 5']
        }
      );

      Jsc.property(
        'Check that if the filter always returns false, then everything is in "fail"',
        Jsc.array(Jsc.json),
        function (arr) {
          var output = Arr.partition(arr, Fun.constant(false));
          return Jsc.eq(0, output.pass.length) && Jsc.eq(arr, output.fail);
        }
      );

      Jsc.property(
        'Check that if the filter always returns true, then everything is in "pass"',
        Jsc.array(Jsc.json),
        function (arr) {
          var output = Arr.partition(arr, Fun.constant(true));
          return Jsc.eq(0, output.fail.length) && Jsc.eq(arr, output.pass);
        }
      );
   
      Jsc.property(
        'Check that everything in fail fails predicate and everything in pass passes predicate',
        Jsc.array(Jsc.json),
        Jsc.fun(Jsc.bool),
        function (arr, predicate) {
          var output = Arr.partition(arr, predicate);

          return Arr.forall(output.fail, function (x) {
            return predicate(x) === false;
          }) && Arr.forall(output.pass, function (x) {
            return predicate(x) === true;
          });
        }
      );
    })();
  }
);