/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { CellOpSelection, Selections, TableSelection } from '@ephox/darwin';
import { Arr, Fun, Optionals } from '@ephox/katamari';
import { TableLookup } from '@ephox/snooker';
import { Attribute, Compare, SelectorFind, SugarElement, SugarElements, SugarNode } from '@ephox/sugar';

import { ephemera } from './Ephemera';

const getSelectionCellFallback = (element: SugarElement<Node>) =>
  TableLookup.table(element).bind((table) =>
    TableSelection.retrieve(table, ephemera.firstSelectedSelector)
  ).fold(Fun.constant(element), (cells) => cells[0]);

const getSelectionFromSelector = <T extends Element>(selector: string) =>
  (initCell: SugarElement<Node>, isRoot?: (el: SugarElement<Node>) => boolean) => {
    const cellName = SugarNode.name(initCell);
    const cell = cellName === 'col' || cellName === 'colgroup' ? getSelectionCellFallback(initCell) : initCell;
    return SelectorFind.closest<T>(cell, selector, isRoot);
  };

const getSelectionCaption = getSelectionFromSelector<HTMLTableCaptionElement>('caption');

const getSelectionCellOrCaption = getSelectionFromSelector<HTMLTableCellElement | HTMLTableCaptionElement>('th,td,caption');

const getSelectionCell = getSelectionFromSelector<HTMLTableCellElement>('th,td');

const getCellsFromSelection = (selected: SugarElement<Node>, selections: Selections, isRoot?: (el: SugarElement<Node>) => boolean): SugarElement<HTMLTableCellElement>[] =>
  getSelectionCell(selected, isRoot)
    .map((_cell) => CellOpSelection.selection(selections))
    .getOr([]);

const getRowsFromSelection = (selected: SugarElement<Node>, selector: string): SugarElement<HTMLTableRowElement>[] => {
  const cellOpt = getSelectionCell(selected);
  const rowsOpt = cellOpt.bind((cell) => TableLookup.table(cell))
    .map((table) => TableLookup.rows(table));
  return Optionals.lift2(cellOpt, rowsOpt, (cell, rows) =>
    Arr.filter(rows, (row) =>
      Arr.exists(SugarElements.fromDom(row.dom.cells), (rowCell) =>
        Attribute.get(rowCell, selector) === '1' || Compare.eq(rowCell, cell)
      )
    )
  ).getOr([]);
};

export {
  getSelectionCaption,
  getSelectionCell,
  getSelectionCellOrCaption,
  getCellsFromSelection,
  getRowsFromSelection
};
