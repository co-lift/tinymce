import { Cursors } from '@ephox/agar';
import { GuiFactory } from '@ephox/alloy';
import { Fun } from '@ephox/katamari';
import { Focus } from '@ephox/sugar';
import { Element } from '@ephox/sugar';
import { Attr } from '@ephox/sugar';
import { WindowSelection } from '@ephox/sugar';
import TestEditor from './TestEditor';



export default <any> function () {
  var frame = Element.fromTag('iframe');
  Attr.set(frame, 'src', '/project/src/themes/mobile/test/html/editor.html');

  var config = {
    getFrame: function () {
      return frame;
    },
    onDomChanged: function () {
      return { unbind: Fun.noop };
    }
  };

  var delegate = TestEditor();
  var dEditor = delegate.editor();

  var editor = {
    selection: {
      getStart: function () {
        return WindowSelection.getExact(frame.dom().contentWindow).map(function (sel) {
          return sel.start().dom();
        }).getOr(null);
      },
      getContent: function () {
        return frame.dom().contentWindow.document.body.innerHTML;
      },
      select: Fun.noop
    },

    getBody: function () {
      return frame.dom().contentWindow.document.body;
    },

    insertContent: dEditor.insertContent,
    execCommand: dEditor.execCommand,
    dom: dEditor.dom,
    // Maybe this should be implemented
    focus: function () {
      Focus.focus(frame);
      var win = frame.dom().contentWindow;
      WindowSelection.getExact(win).orThunk(function () {
        var fbody = Element.fromDom(frame.dom().contentWindow.document.body);
        var elem = Cursors.calculateOne(fbody, [ 0 ]);
        WindowSelection.setExact(win, elem, 0, elem, 0);
      });
    }
  };

  var component = GuiFactory.build(
    GuiFactory.external({
      element: frame
    })
  );

  return {
    component: Fun.constant(component),
    config: Fun.constant(config),
    editor: Fun.constant(editor),
    adder: delegate.adder,
    assertEq: delegate.assertEq,
    sAssertEq: delegate.sAssertEq,
    sClear: delegate.sClear,
    sPrepareState: delegate.sPrepareState
  };
};