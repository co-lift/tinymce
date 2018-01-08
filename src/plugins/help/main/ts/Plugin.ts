/**
 * PLugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import PluginManager from 'tinymce/core/PluginManager';
import Commands from './api/Commands';
import Buttons from './ui/Buttons';
import Dialog from './ui/Dialog';

PluginManager.add('help', function (editor, pluginUrl) {
  Buttons.register(editor, pluginUrl);
  Commands.register(editor, pluginUrl);
  editor.shortcuts.add('Alt+0', 'Open help dialog', 'mceHelp');
});

export default <any> function () {};