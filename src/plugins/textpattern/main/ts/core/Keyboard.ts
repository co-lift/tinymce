/**
 * Keyboard.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Delay from 'tinymce/core/util/Delay';
import VK from 'tinymce/core/util/VK';
import KeyHandler from './KeyHandler';

var setup = function (editor, patternsState) {
  var charCodes = [',', '.', ';', ':', '!', '?'];
  var keyCodes = [32];

  editor.on('keydown', function (e) {
    if (e.keyCode === 13 && !VK.modifierPressed(e)) {
      KeyHandler.handleEnter(editor, patternsState.get());
    }
  }, true);

  editor.on('keyup', function (e) {
    if (KeyHandler.checkKeyCode(keyCodes, e)) {
      KeyHandler.handleInlineKey(editor, patternsState.get());
    }
  });

  editor.on('keypress', function (e) {
    if (KeyHandler.checkCharCode(charCodes, e)) {
      Delay.setEditorTimeout(editor, function () {
        KeyHandler.handleInlineKey(editor, patternsState.get());
      });
    }
  });
};

export default <any> {
  setup: setup
};