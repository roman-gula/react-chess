import React from 'react';
import Cell from '../components/chessboard-cell';
import renderer from 'react-test-renderer';

test('Cell color corresponds with its index', () => {
	const palette = ['white', 'black'];

	// cell indexes and valid color indexes (0 -- 'white', 1 -- 'black')
	let data = [[3, 0], [29, 1], [35, 0], [44, 0], [61, 1]];

	data.forEach(([index, colorIndex]) => {
		let expectedColor = palette[colorIndex];

		let props = { index, palette };

		checkCell(props, expectedColor)
	});

	function checkCell(props, expectedColor) {
		const component = renderer.create(
			<Cell {...props}/>
		);

		let cell = component.toJSON();

		expect(cell.props.style.backgroundColor).toEqual(expectedColor);
	}

});