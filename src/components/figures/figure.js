import React from 'react';
import '../../styles/figure.css';

const MIN = 1;
const MAX = 64;

class Figure extends React.Component {
  componentDidUpdate() {
    this.cellsToMove = this.getCellsToMove();
  }

  get row() {
    return Math.ceil(this.props.position / 8);
  }

  get column() {
    return this.props.position - (this.row - 1) * 8;
  }

  getPossibleCells() {
    return [];
  }

  moveRight() {
    let res = [];
    for (let i = 1; i <= 8 - this.column; i++) res.push(this.props.position + i);
    return res;
  }

  moveLeft() {
    let res = [];
    for (let i = 1; i < this.column; i++) res.push(this.props.position - i);
    return res;
  }

  moveBottom() {
    let res = [];
    for (let i = 1; i <= 8 - this.row; i++) res.push(this.props.position + i * 8);
    return res;
  }

  moveTop() {
    let res = [];
    for (let i = 1; i < this.row; i++) res.push(this.props.position - i * 8);
    return res;
  }

  moveRightBottom() {
    let res = [];
    for (let i = 1; i <= 8 - this.column && i <= 8 - this.row; i++) res.push(this.props.position + i * 9);
    return res;
  }

  moveLeftBottom() {
    let res = [];
    for (let i = 1; i < this.column && i <= 8 - this.row; i++) res.push(this.props.position + i * 7);
    return res;
  }

  moveLeftTop() {
    let res = [];
    for (let i = 1; i < this.column && i < this.row; i++) res.push(this.props.position - i * 9);
    return res;
  }

  moveRightTop() {
    let res = [];
    for (let i = 1; i <= 8 - this.column && i < this.row; i++) res.push(this.props.position - i * 7);
    return res;
  }

  getCellsByDirection(direction) {
    let result = [];
    let possibleCells = this['move' + direction]();

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
    if (!this.directions || this.directions.length === 0) return [];

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

    if (position < MIN || position > MAX) throw new Error('Wrong position');

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

    res = res.filter(item => item >= MIN && item <= MAX);

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

    let beatCells = isWhite ? [this.moveLeftTop()[0], this.moveRightTop()[0]] : [this.moveLeftBottom()[0], this.moveRightBottom()[0]];

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
  get directions() {
    return ['LeftTop', 'RightTop', 'LeftBottom', 'RightBottom', 'Left', 'Right', 'Top', 'Bottom'];
  }
}

class King extends Figure {
  get directions() {
    return ['LeftTop', 'RightTop', 'LeftBottom', 'RightBottom', 'Left', 'Right', 'Top', 'Bottom'];
  }

  get stepMaxLength() {
    return 1;
  }
}

class Rook extends Figure {
  get directions() {
    return ['Left', 'Right', 'Top', 'Bottom'];
  }
}

class Bishop extends Figure {
  get directions() {
    return ['LeftTop', 'RightTop', 'LeftBottom', 'RightBottom'];
  }
}

let Figures = { Knight, Pawn, Queen, Rook, Bishop, King };

export { Figure };

export default Figures;
