import React from 'react';
import '../../styles/figure.css';

import settings from '../../settings';

const { MIN_POSITION, MAX_POSITION, DIRECTIONS } = settings;

class Figure extends React.Component {
  directions = [];

  componentDidUpdate() {
    this.cellsToMove = this.getCellsToMove();
  }

  get row() {
    return Math.ceil(this.props.position / 8);
  }

  get column() {
    return this.props.position - (this.row - 1) * 8;
  }

  getAllCellsByDirection(direction) {
    const res = [];

    switch (direction) {
      case DIRECTIONS[0]:
        for (let i = 1; i < this.column && i < this.row; i++) res.push(this.props.position - i * 9);
        break;
      case DIRECTIONS[1]:
        for (let i = 1; i <= 8 - this.column && i < this.row; i++) res.push(this.props.position - i * 7);
        break;
      case DIRECTIONS[2]:
        for (let i = 1; i < this.column && i <= 8 - this.row; i++) res.push(this.props.position + i * 7);
        break;
      case DIRECTIONS[3]:
        for (let i = 1; i <= 8 - this.column && i <= 8 - this.row; i++) res.push(this.props.position + i * 9);
        break;
      case DIRECTIONS[4]:
        for (let i = 1; i < this.column; i++) res.push(this.props.position - i);
        break;
      case DIRECTIONS[5]:
        for (let i = 1; i <= 8 - this.column; i++) res.push(this.props.position + i);
        break;
      case DIRECTIONS[6]:
        for (let i = 1; i < this.row; i++) res.push(this.props.position - i * 8);
        break;
      case DIRECTIONS[7]:
        for (let i = 1; i <= 8 - this.row; i++) res.push(this.props.position + i * 8);
        break;
    }

    return res;
  }

  getCellsByDirection(direction) {
    let result = [];
    let possibleCells = this.getAllCellsByDirection(direction);

    if (!possibleCells.length) return result;

    let { isWhite, getCellFigure } = this.props;

    let length = this.stepMaxLength ? this.stepMaxLength : possibleCells.length;

    for (let i = 0; i < length; i++) {
      let cellIndex = possibleCells[i];

      let cellFigureColor = getCellFigure(cellIndex);

      if (!isWhite === cellFigureColor || cellFigureColor === undefined) {
        result.push(cellIndex);

        if (!isWhite === cellFigureColor) break;
      } else {
        break;
      }
    }

    return result;
  }

  getCellsToMove() {
    let result = [];

    this.directions.forEach(direction => {
      Array.prototype.push.apply(result, this.getCellsByDirection(direction));
    });

    return result;
  }

  onDragStart(e) {
    if (!this.cellsToMove.length || !this.props.isNext) {
      e.preventDefault();
    } else {
      e.dataTransfer.setData('text/plain', this.props.position);
    }
  }

  showVariants() {
    if (this.props.isNext) this.props.highlightCells(this.getCellsToMove());
  }

  render() {
    let { isWhite, type, isNext, disableHighlightCells } = this.props;

    let color = isWhite ? 'white' : 'black';

    let classNames = ['chess-figure', `figure-${color}`, `figure-${type}`];

    if (isNext) classNames.push('figure-is-next');

    let onDragStart = this.onDragStart.bind(this);

    return (
      <div
        onMouseEnter={this.showVariants.bind(this)}
        onMouseLeave={disableHighlightCells}
        draggable="true"
        onDragStart={onDragStart}
        className={classNames.join(' ')}
      />
    );
  }
}

class Knight extends Figure {
  getPossibleCells() {
    let { position } = this.props;

    if (position < MIN_POSITION || position > MAX_POSITION) throw new Error('Wrong position');

    let res = [];
    let { column } = this;

    if (column > 1) {
      res.push(position + 15);
      res.push(position - 17);

      if (column > 2) {
        res.push(position + 6);
        res.push(position - 10);
      }
    }

    if (column < 8) {
      res.push(position + 17);
      res.push(position - 15);

      if (column < 7) {
        res.push(position + 10);
        res.push(position - 6);
      }
    }

    res = res.filter(item => item >= MIN_POSITION && item <= MAX_POSITION);

    return res;
  }

  getCellsToMove() {
    return this.getPossibleCells().filter(cellIndex => {
      let cellFigureIsWhite = this.props.getCellFigure(cellIndex);

      let cellHasTeammate = cellFigureIsWhite === this.props.isWhite;

      return !cellHasTeammate;
    });
  }
}

class Pawn extends Figure {
  getPossibleCells() {
    let { position, isWhite, initialPosition } = this.props;

    let correction = isWhite ? -8 : 8;

    let result = [position + correction];

    if (position === initialPosition) result.push(position + 2 * correction);

    return result;
  }

  getCellsToMove() {
    let { isWhite, position, getCellFigure } = this.props;
    let possibleCells = this.getPossibleCells();

    let beatCells = isWhite
      ? [this.getAllCellsByDirection(DIRECTIONS[0])[0], this.getAllCellsByDirection(DIRECTIONS[1])[0]]
      : [this.getAllCellsByDirection(DIRECTIONS[2])[0], this.getAllCellsByDirection(DIRECTIONS[3])[0]];

    possibleCells = possibleCells.concat(beatCells);

    possibleCells = possibleCells.filter(cellIndex => {
      if (!cellIndex) return false;

      let cellFigureIsWhite = getCellFigure(cellIndex);

      let correction = isWhite ? -8 : 8;

      if (position + correction * 2 === cellIndex && getCellFigure(position + correction) !== undefined) return false;

      if (beatCells.includes(cellIndex)) return !isWhite === cellFigureIsWhite;

      return cellFigureIsWhite === undefined; // no figure on the cell
    });

    return possibleCells;
  }
}

class Queen extends Figure {
  directions = DIRECTIONS;
}

class King extends Figure {
  directions = DIRECTIONS;

  stepMaxLength = 1;
}

class Rook extends Figure {
  directions = DIRECTIONS.slice(4);
}

class Bishop extends Figure {
  directions = DIRECTIONS.slice(0, 4);
}

let Figures = { Knight, Pawn, Queen, Rook, Bishop, King };

export { Figure };

export default Figures;
