import { GeneralSteps } from '@ephox/agar';
import { Pipeline } from '@ephox/agar';
import { TinyApis } from '@ephox/mcagar';
import { TinyLoader } from '@ephox/mcagar';
import { TinyUi } from '@ephox/mcagar';
import Plugin from 'tinymce/plugins/media/Plugin';
import Utils from '../module/test/Utils';
import Theme from 'tinymce/themes/modern/Theme';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('browser.core.DataAttributeTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];

  Plugin();
  Theme();

  var sTestEmbedContentFromUrlWithAttribute = function (ui, url, content) {
    return GeneralSteps.sequence([
      Utils.sOpenDialog(ui),
      Utils.sPasteSourceValue(ui, url),
      Utils.sAssertEmbedContent(ui, content),
      Utils.sSubmitAndReopen(ui),
      Utils.sAssertSourceValue(ui, url),
      Utils.sCloseDialog(ui)
    ]);
  };
  var sTestEmbedContentFromUrl2 = function (ui, url, url2, content, content2) {
    return GeneralSteps.sequence([
      Utils.sOpenDialog(ui),
      Utils.sPasteSourceValue(ui, url),
      Utils.sAssertEmbedContent(ui, content),
      Utils.sSubmitAndReopen(ui),
      Utils.sAssertSourceValue(ui, url),
      Utils.sPasteSourceValue(ui, url2),
      Utils.sAssertEmbedContent(ui, content2),
      Utils.sCloseDialog(ui)
    ]);
  };

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    var ui = TinyUi(editor);
    var api = TinyApis(editor);

    Pipeline.async({}, [
      sTestEmbedContentFromUrlWithAttribute(ui,
        'a',
        '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>'
      ),
      sTestEmbedContentFromUrl2(ui, 'a', 'b',
        '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>',
        '<div data-ephox-embed-iri="b" style="max-width: 300px; max-height: 150px"></div>'
      ),
      Utils.sTestEmbedContentFromUrl(ui,
        'a',
        '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>'
      ),
      Utils.sAssertSizeRecalcConstrained(ui),
      Utils.sAssertSizeRecalcUnconstrained(ui),
      api.sSetContent(''),
      Utils.sAssertSizeRecalcConstrainedReopen(ui, api)
    ], onSuccess, onFailure);
  }, {
    plugins: ["media"],
    toolbar: "media",
    media_url_resolver: function (data, resolve) {
      resolve({ html: '<div data-ephox-embed-iri="' + data.url + '" style="max-width: 300px; max-height: 150px"></div>' });
    },
    skin_url: '/project/js/tinymce/skins/lightgray'
  }, success, failure);
});

