import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import App from '../app';

// saved data
let mockData = {
	isWhiteTurn: false,
	turnNumber: 326,
	palette: ['white', 'black'],
	figures: [
		{
			type: 'pawn',
			initialPosition: 10,
			isWhite: false,
			position: 44
		},
		{
			type: 'knight',
			initialPosition: 63,
			isWhite: true,
			position: 38
		},
		{
			type: 'pawn',
			initialPosition: 53,
			isWhite: true,
			position: 53
		}
	]
};

// emulating localStorage
let localStorageMock = (function() {
	let store = {
		chessGameSaveData: JSON.stringify(mockData)
	};
	return {
		getItem: function(key) {
			return store[key];
		},
		setItem: function(key, value) {
			store[key] = value.toString();
		},
		clear: function() {
			store = {};
		},
		removeItem: function(key) {
			delete store[key];
		}
	};
})();

window.localStorage = localStorageMock;

it('Renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<App />, div);
});

test('Simple game flow with saved data', () => {
	const component = TestUtils.renderIntoDocument(<App />);

	let buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

	let [ newGameButton, loadButton, deleteSavedButton ] = buttons;

	// click on New game button
	TestUtils.Simulate.click(newGameButton);

	let figures = getFigures();

	// at the start of the game there must be 32 figures on the board
	expect(figures.length).toEqual(32);
	expect(component.figures.length).toEqual(32);

	// click on Load button
	TestUtils.Simulate.click(loadButton);

	figures = getFigures();

	expect(figures.length).toEqual(3);
	expect(component.figures.length).toEqual(3);

	// black pawn beats white pawn
	component.moveFigure(44, 53);

	figures = getFigures();

	expect(figures.length).toEqual(2);
	expect(component.figures.length).toEqual(3);

	let captive = component.figures.find(f => f.initialPosition === 53);

	expect(captive.position).toEqual(null);

	// white knight beats black pawn
	component.moveFigure(38, 53);

	figures = getFigures();

	expect(figures.length).toEqual(1);
	expect(component.figures.length).toEqual(3);

	captive = component.figures.find(f => f.initialPosition === 10);

	expect(captive.position).toEqual(null);

	TestUtils.Simulate.click(deleteSavedButton);

	expect(component.savedData).toEqual(null);

	function getFigures() {
		return TestUtils.scryRenderedDOMComponentsWithClass(component, 'chess-figure');
	}

});
