/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Env from 'tinymce/core/Env';
import PluginManager from 'tinymce/core/PluginManager';
import Commands from './api/Commands';
import FilterContent from './core/FilterContent';
import ResolveName from './core/ResolveName';
import Buttons from './ui/Buttons';

PluginManager.add('pagebreak', function (editor) {
  Commands.register(editor);
  Buttons.register(editor);
  FilterContent.setup(editor);
  ResolveName.setup(editor);
});

export default <any> function () { };