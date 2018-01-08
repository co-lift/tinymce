/**
 * LoadImage.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Promise from 'tinymce/core/util/Promise';

var loadImage = function (image) {
  return new Promise(function (resolve) {
    var loaded = function () {
      image.removeEventListener('load', loaded);
      resolve(image);
    };

    if (image.complete) {
      resolve(image);
    } else {
      image.addEventListener('load', loaded);
    }
  });
};

export default <any> {
  loadImage: loadImage
};