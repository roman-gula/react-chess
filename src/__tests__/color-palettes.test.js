import React from 'react';
import TestUtils from 'react-dom/test-utils';

import ColorPalettes from '../components/color-palettes';

// renderIntoDocument does not work with function components
class Wrapper extends React.Component {
  render() {
    return this.props.children;
  }
}

test('Palette component changes colors', () => {
  let palette;

  const setPalette = p => (palette = p);

  const component = TestUtils.renderIntoDocument(
    <Wrapper>
      <ColorPalettes setPalette={setPalette} palette={palette} />
    </Wrapper>
  );

  let listItems = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');

  // click on palette item
  TestUtils.Simulate.change(listItems[3]);

  let [wColor, bColor] = palette;

  expect(wColor).toEqual('#FFFFE0');
  expect(bColor).toEqual('#556B2F');
});
