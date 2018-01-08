/**
 * SelectionUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import { Arr } from '@ephox/katamari';
import { Fun } from '@ephox/katamari';
import { Option } from '@ephox/katamari';
import { Options } from '@ephox/katamari';
import { Compare } from '@ephox/sugar';
import { Element } from '@ephox/sugar';
import { Node } from '@ephox/sugar';
import { Traverse } from '@ephox/sugar';
import NodeType from '../dom/NodeType';

var getStartNode = function (rng) {
  var sc = rng.startContainer, so = rng.startOffset;
  if (NodeType.isText(sc)) {
    return so === 0 ? Option.some(Element.fromDom(sc)) : Option.none();
  } else {
    return Option.from(sc.childNodes[so]).map(Element.fromDom);
  }
};

var getEndNode = function (rng) {
  var ec = rng.endContainer, eo = rng.endOffset;
  if (NodeType.isText(ec)) {
    return eo === ec.data.length ? Option.some(Element.fromDom(ec)) : Option.none();
  } else {
    return Option.from(ec.childNodes[eo - 1]).map(Element.fromDom);
  }
};

var getFirstChildren = function (node) {
  return Traverse.firstChild(node).fold(
    Fun.constant([node]),
    function (child) {
      return [node].concat(getFirstChildren(child));
    }
  );
};

var getLastChildren = function (node) {
  return Traverse.lastChild(node).fold(
    Fun.constant([node]),
    function (child) {
      if (Node.name(child) === 'br') {
        return Traverse.prevSibling(child).map(function (sibling) {
          return [node].concat(getLastChildren(sibling));
        }).getOr([]);
      } else {
        return [node].concat(getLastChildren(child));
      }
    }
  );
};

var hasAllContentsSelected = function (elm, rng) {
  return Options.liftN([getStartNode(rng), getEndNode(rng)], function (startNode, endNode) {
    var start = Arr.find(getFirstChildren(elm), Fun.curry(Compare.eq, startNode));
    var end = Arr.find(getLastChildren(elm), Fun.curry(Compare.eq, endNode));
    return start.isSome() && end.isSome();
  }).getOr(false);
};

export default <any> {
  hasAllContentsSelected: hasAllContentsSelected
};