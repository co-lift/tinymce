import { GuiFactory } from '@ephox/alloy';
import { Attachment } from '@ephox/alloy';
import { Gui } from '@ephox/alloy';
import { Container } from '@ephox/alloy';
import { Fun } from '@ephox/katamari';
import { SelectorFind } from '@ephox/sugar';
import ColorSlider from 'tinymce/themes/mobile/ui/ColorSlider';
import FontSizeSlider from 'tinymce/themes/mobile/ui/FontSizeSlider';
import UiDomFactory from 'tinymce/themes/mobile/util/UiDomFactory';



export default <any> function () {
  var ephoxUi = SelectorFind.first('#ephox-ui').getOrDie();


  var fontSlider = Container.sketch({
    dom: UiDomFactory.dom('<div class="${prefix}-toolbar ${prefix}-context-toolbar"></div>'),
    components: [
      {
        dom: UiDomFactory.dom('<div class="${prefix}-toolbar-group"></div>'),
        components: FontSizeSlider.makeItems({
          onChange: Fun.noop,
          getInitialValue: Fun.constant(2)
        })
      }
    ]
  });

  var colorSlider = Container.sketch({
    dom: UiDomFactory.dom('<div class="${prefix}-toolbar ${prefix}-context-toolbar"></div>'),
    components: [
      {
        dom: UiDomFactory.dom('<div class="${prefix}-toolbar-group"></div>'),
        components: ColorSlider.makeItems({
          onChange: Fun.noop,
          getInitialValue: Fun.constant(-1)
        })
      }
    ]
  });

  var gui = Gui.create();
  Attachment.attachSystem(ephoxUi, gui);

  var container = GuiFactory.build({
    dom: UiDomFactory.dom('<div class="{prefix}-outer-container ${prefix}-fullscreen-maximized"></div>'),
    components: [
      {
        dom: UiDomFactory.dom('<div class="${prefix}-toolstrip"></div>'),
        components: [ fontSlider ]
      },
      {
        dom: UiDomFactory.dom('<div class="${prefix}-toolstrip"></div>'),
        components: [ colorSlider ]
      }
    ]
  });

  gui.add(container);
};