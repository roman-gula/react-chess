import React, { Component } from 'react';

import Cell from './components/chessboard-cell';
import ColorPalettes from './components/color-palettes.js';
import './app.css';

class Storage {
	get key() {
		return 'chessGameSaveData';
	}

	saveData(data) {
		window.localStorage.setItem(this.key, JSON.stringify(data));
	}

	getData() {
		let data = window.localStorage.getItem(this.key);

		if(!data) return null;

		return JSON.parse(data);
	}

	deleteData() {
		window.localStorage.removeItem(this.key);
	}
}

class App extends Component {
    constructor(props) {
        super(props);

        this.store = new Storage();

		window.addEventListener('resize', this.setBoardSize.bind(this));

        this.highLightCells = this.highLightCells.bind(this);
        this.moveFigure = this.moveFigure.bind(this);
        this.getCellHasFigure = this.getCellHasFigure.bind(this);
        this.disableHighLightCells = this.disableHighLightCells.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.deleteSavedData = this.deleteSavedData.bind(this);
        this.setPalette = this.setPalette.bind(this);

        let cells = getCells();

        this.state = { cells };
    }

	componentDidMount() {
		this.setBoardSize();
    }

	setBoardSize() {
		let boardSize = getBoardSize();

		this.setState({ boardSize });
	}

    setPalette(palette) {
    	this.setState({ palette });
	}

	initGame(data = {}) {
    	let { isWhiteTurn = true, turnNumber = 0, palette, figures } = data;

		this.turnNumber = turnNumber;
		this.isWhiteTurn = isWhiteTurn;

		this.figures = figures === undefined ? getInitialFigures() : figures;

		let cells = getCells(this.figures);

		this.setState({ cells, palette });
	}

	saveGame() {
    	let { isWhiteTurn, turnNumber, figures } = this;
    	let { palette } = this.state;

    	this.store.saveData({ isWhiteTurn, turnNumber, palette, figures });

    	this.setState({isSaved: true});
	}

	deleteSavedData() {
    	this.store.deleteData();

		this.setState({isSaved: false});
	}

	get savedData() {
    	return this.store.getData();
	}

	changeTurn() {
		this.isWhiteTurn = !this.isWhiteTurn;
		this.turnNumber++;
	}

    highLightCells(cellIndexes) {
		let cells = this.state.cells;

		cellIndexes.forEach(index => {
			let cell = cells[index - 1];

			cell.highLighted = true;
		});

		this.setState({cells});
    }

    getCellHasFigure(cellIndex) {
		let { figure } = this.state.cells[cellIndex - 1];

		return figure ? figure.isWhite : undefined;
	}

    disableHighLightCells() {
		let { cells } = this.state;

		cells.forEach((cell) => { cell.highLighted = false });

		this.setState({cells});
	}

	moveFigure(positionFrom, positionTo) {
		let { cells } = this.state;

	 	let needed = cells.filter(cell => [positionFrom, positionTo].includes(cell.index));

	 	let cellFrom = needed.find(cell => cell.index === positionFrom);
	 	let cellTo = needed.find(cell => cell.index === positionTo);

	 	let { figure } = cellFrom;

	 	let { figure:captive } = cellTo;

	 	if(captive) captive.position = null;

	 	figure.position = positionTo;

	 	cellFrom.figure = null;

	 	cellTo.figure = figure;

	 	this.disableHighLightCells();

		this.changeTurn();
	}

    render() {
		let { cells, palette, boardSize } = this.state;

		let { saveGame, isWhiteTurn,  highLightCells, moveFigure, setPalette,
			getCellHasFigure, disableHighLightCells, turnNumber, deleteSavedData } = this;

		let savedData = this.savedData;

        return (
        	<main id="chess-game">
				<menu id="actions-menu">
					<button onClick={ () => this.initGame({palette}) } id="new-game-button">New game</button>
					{ turnNumber > 0 && <button onClick={ saveGame } id="save-game-button">Save</button> }
					{ savedData && <button onClick={ () => this.initGame(savedData) } id="load-game-button">Load</button> }
					{ savedData && <button onClick={ deleteSavedData } id="load-game-button">Delete saved</button> }
					<details id="palettes-list">
						<summary>Change colors palette</summary>
						<ColorPalettes setPalette={setPalette}/>
					</details>
				</menu>
				{palette && <section id="chessboard" style={{height: boardSize, width: boardSize}}>
					{
						cells.map(props => {
							let isNext = props.figure ? props.figure.isWhite === isWhiteTurn : false;
							let figureProps = { highLightCells, getCellHasFigure, disableHighLightCells, isNext };
							let cellProps = { palette, figureProps, moveFigure, ...props };

							return <Cell { ...cellProps } key={'cell' + props.index} />
						})
					}
				</section>}
			</main>
        );
    }
}

export default App;

function getBoardSize() {
	return Math.min(window.innerWidth, window.innerHeight);
}

function getCells(figures = []) {
    let cells = [];

    let index = 0;

	while(++index < 65) {
	    let figure = figures.find(matchIndex);

		cells.push(figure ? {figure, index} : {index});
	}

	function matchIndex({position}) {
		return position === index
	}

	return cells;
}

function getInitialFigures() {
	const FIGURES_CONFIG = [
		{rook: {black: [1, 8], white: [57, 64]}},
		{knight: {black: [2, 7], white: [58, 63]}},
		{bishop: {black: [3, 6], white: [59, 62]}},
		{queen: {black: [4], white: [60]}},
		{king: {black: [5], white: [61]}},
		{pawn: {black: [9, 10, 11, 12, 13, 14, 15, 16], white: [49, 50, 51, 52, 53, 54, 55, 56]}}
	];

	let figures = [];

	FIGURES_CONFIG.forEach(item => {
		initTypes(item);
	});

	function initTypes(item) {
		for(let type in item) {
			let data = item[type];

			initFigure(type, false, data.black);
			initFigure(type, true, data.white);
		}
	}

	function initFigure(type, isWhite, initialPositions) {
		initialPositions.forEach(initialPosition => {
			figures.push({ type, isWhite, initialPosition, position:initialPosition });
		});
	}

	return figures;
}