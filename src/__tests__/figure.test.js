import React from 'react';
import { Figure } from '../components/figure';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const MIN_POSITION = 1;
const MAX_POSITION = 64;

test('Movement methods return valid positions', () => {
  const METHODS = ['moveRight', 'moveLeft', 'moveBottom', 'moveTop', 'moveRightBottom', 'moveLeftBottom', 'moveLeftTop', 'moveRightTop'];

  for (let position = MIN_POSITION; position <= MAX_POSITION; position++) {
    METHODS.forEach(methodName => {
      const component = shallow(<Figure position={position} />);

      let figure = component.instance();

      let variants = figure[methodName]();

      let result = variants.every(inRange);

      expect(result).toBeTruthy();

      function inRange(pos) {
        return pos >= MIN_POSITION && pos <= MAX_POSITION;
      }
    });
  }
});
