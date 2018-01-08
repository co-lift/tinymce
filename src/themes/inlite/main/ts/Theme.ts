/**
 * Theme.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import ThemeManager from 'tinymce/core/ThemeManager';
import ThemeApi from './api/ThemeApi';
import Buttons from './ui/Buttons';
import Panel from './ui/Panel';
import Api from 'tinymce/ui/Api';
import FormatControls from 'tinymce/ui/FormatControls';

declare let window: any;

Api.registerToFactory();
Api.appendTo(window.tinymce ? window.tinymce : {});

ThemeManager.add('inlite', function (editor) {
  var panel = new Panel();

  FormatControls.setup(editor);
  Buttons.addToEditor(editor, panel);

  return ThemeApi.get(editor, panel);
});

export default <any> function () { };