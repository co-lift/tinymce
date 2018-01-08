import { GeneralSteps } from '@ephox/agar';
import { Logger } from '@ephox/agar';
import { Mouse } from '@ephox/agar';
import { Pipeline } from '@ephox/agar';
import { Step } from '@ephox/agar';
import { Memento } from '@ephox/alloy';
import { Attachment } from '@ephox/alloy';
import GuiSetup from '../../module/test/GuiSetup';
import { Body } from '@ephox/sugar';
import { Class } from '@ephox/sugar';
import { Traverse } from '@ephox/sugar';
import TinyChannels from 'tinymce/themes/mobile/channels/TinyChannels';
import TestEditor from '../../module/test/ui/TestEditor';
import TestStyles from '../../module/test/ui/TestStyles';
import TestUi from '../../module/test/ui/TestUi';
import Buttons from 'tinymce/themes/mobile/ui/Buttons';
import IosRealm from 'tinymce/themes/mobile/ui/IosRealm';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('Browser Test: ui.ButtonsTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];

  /*
   * PURPOSE
   *
   * There are three buttons. Two have toggling, and one toggling button has a custom action.
   * Ensure that they all fire the right actions and get updated appropriately based on broadcasts.
   */

  var realm = IosRealm();

  var body = Body.body();
  Attachment.attachSystem(body, realm.system());

  // Make toolbar appear
  Class.add(realm.system().element(), 'tinymce-mobile-fullscreen-maximized');

  var doc = Traverse.owner(body);

  TestStyles.addStyles();

  var unload = function () {
    TestStyles.removeStyles();
    Attachment.detachSystem(realm.system());
  };

  /* The test editor puts execCommand and insertContent calls into the store */
  var tEditor = TestEditor();

  var memAlpha = Memento.record(
    Buttons.forToolbarCommand(tEditor.editor(), 'alpha')
  );

  var memBeta = Memento.record(
    Buttons.forToolbarStateCommand(tEditor.editor(), 'beta')
  );

  var memGamma = Memento.record(
    Buttons.forToolbarStateAction(tEditor.editor(), 'gamma-class', 'gamma-query', function () {
      tEditor.adder('gamma-action')();
    })
  );

  var sClickAlpha = TestUi.sClickComponent(realm, memAlpha);
  var sClickBeta = TestUi.sClickComponent(realm, memBeta);
  var sClickGamma = TestUi.sClickComponent(realm, memGamma);

  var sCheckComponent = function (label, state) {
    return function (memento) {
      return TestUi.sWaitForToggledState(label, state, realm, memento);
    };
  };

  realm.setToolbarGroups([
    {
      label: 'group1',
      items: [
        memAlpha.asSpec(),
        memBeta.asSpec(),
        memGamma.asSpec()
      ]
    }
  ]);

  /*
   * Alpha has no toggling, so just check that when the user clicks on the button, the 
   * editor fires execCommand with alpha
   */
  var sTestAlpha = GeneralSteps.sequence([
    tEditor.sAssertEq('Initially empty', [ ]),
    sClickAlpha,
    tEditor.sAssertEq('After clicking on alpha', [
      {
        method: 'execCommand',
        data: {
          'alpha': undefined
        }
      }
    ]),
    tEditor.sClear
  ]);

  /*
   * Beta has toggling, so check:
   *  - when the user clicks on the button, execCommand is fired
   *  - when the format change is broadcast, the toggled state changes
   */
  var sTestBeta = GeneralSteps.sequence([
    tEditor.sAssertEq('before beta, store is empty', [ ]),
    sClickBeta,
    tEditor.sAssertEq('After clicking on beta', [
      {
        method: 'execCommand',
        data: {
          'beta': undefined
        }
      }
    ]),
    tEditor.sClear,
    sCheckComponent('Initially, beta should be unselected', false)(memBeta),
    // Fire a format change
    TestUi.sBroadcastState(realm, [ TinyChannels.formatChanged() ], 'beta', true),
    sCheckComponent('After broadcast, beta should be selected', true)(memBeta),
    tEditor.sClear
  ]);

  /*
   * Gamma has toggling, and a custom action, so check:
   *  - when the user clicks on the button, the custom action is fired
   *  - when the format change is broadcast, the toggled state changes
   */
  var sTestGamma = GeneralSteps.sequence([
    tEditor.sAssertEq('before gamma, store is empty', [ ]),
    sClickGamma,
    tEditor.sAssertEq('After clicking on gamma', [ 'gamma-action' ]),
    tEditor.sClear,
    sCheckComponent('Initially, gamma should be unselected', false)(memGamma),
    // Fire a format change
    TestUi.sBroadcastState(realm, [ TinyChannels.formatChanged() ], 'gamma-query', true),
    sCheckComponent('After broadcast, gamma should be selected', true)(memGamma)
  ]);

  Pipeline.async({}, [
    GuiSetup.mAddStyles(doc, [
      '.tinymce-mobile-icon-alpha:before { content: "ALPHA"; }',
      '.tinymce-mobile-icon-beta:before { content: "BETA"; }',
      '.tinymce-mobile-icon-gamma-class:before { content: "GAMMA"; }'
    ]),
    TestStyles.sWaitForToolstrip(realm),
    sTestAlpha,
    sTestBeta,
    sTestGamma
  ], function () {
    unload(); success();
  }, failure);
});

