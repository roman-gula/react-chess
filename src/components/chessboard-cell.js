import React, { Component } from 'react';
import Figures, { Figure } from './figure.js';
import '../styles/chessboard-cell.css';

class ChessboardCell extends Component {
  constructor(props) {
    super(props);

    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      index: props.index,
      figure: props.figure
    };
  }

  get row() {
    return Math.ceil(this.props.index / 8);
  }

  get column() {
    return this.props.index - (this.row - 1) * 8;
  }

  get backgroundColor() {
    let { row, column } = this;
    let { palette } = this.props;
    let [whiteColor, blackColor] = palette;

    return (row - 1 + column) % 2 === 0 ? blackColor : whiteColor;
  }

  onDrop(e) {
    if (this.props.highLighted) {
      let positionFrom = e.dataTransfer.getData('text');

      this.props.moveFigure(parseInt(positionFrom, 10), this.props.index);
    }
  }

  onDragOver(e) {
    e.preventDefault();
  }

  render() {
    let { onDragOver, onDrop, backgroundColor } = this;

    let { highLighted, figureProps, figure } = this.props;

    figureProps = { ...figure, ...figureProps };

    let style = { backgroundColor };

    let child = null;

    if (figure) {
      let FigureComponentName = capitalize(figure.type);

      let FigureComponent = Figures[FigureComponentName] || Figure;

      child = <FigureComponent {...figureProps} />;
    }

    let classNames = ['chessboard-cell'];

    if (highLighted) classNames.push('cell-highlighted');

    let props = { style, onDragOver, onDrop, className: classNames.join(' ') };

    return <div {...props}>{child}</div>;
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ChessboardCell;
