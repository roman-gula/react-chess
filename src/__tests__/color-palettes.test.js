import React from 'react';
import TestUtils from 'react-dom/test-utils';

import ColorPalettes from '../components/color-palettes';

test('Palette component changes colors', () => {
  let palette;

  const component = TestUtils.renderIntoDocument(<ColorPalettes setPalette={setPalette} />);

  let listItems = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');

  // click on palette item
  TestUtils.Simulate.change(listItems[3]);

  let [wColor, bColor] = palette;

  expect(wColor).toEqual('#FFFFE0');
  expect(bColor).toEqual('#556B2F');

  function setPalette(p) {
    palette = p;
  }
});
