import React from 'react';
import { Figure } from '../components/figures/figure';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import settings from '../settings';

const { MIN_POSITION, MAX_POSITION, DIRECTIONS } = settings;

test('Movement methods return valid positions', () => {
  for (let position = MIN_POSITION; position <= MAX_POSITION; position++) {
    DIRECTIONS.forEach(direction => {
      const component = shallow(<Figure position={position} />);

      let figure = component.instance();

      let variants = figure.getAllCellsByDirection(direction);

      let result = variants.every(inRange);

      expect(result).toBeTruthy();

      function inRange(pos) {
        return pos >= MIN_POSITION && pos <= MAX_POSITION;
      }
    });
  }
});
