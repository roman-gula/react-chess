import React from 'react';
import Figures, { Figure } from './figures/figure.js';
import '../styles/chessboard-cell.css';

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const getBackgroundColor = ([whiteColor, blackColor], index) => {
  const rowIsEven = Math.ceil(index / 8) % 2 === 0;
  const cellIsEven = index % 2 === 0;

  return rowIsEven === cellIsEven ? whiteColor : blackColor;
};

export default ({ highlighted, figureProps, figure, palette, index, moveFigure }) => {
  const backgroundColor = getBackgroundColor(palette, index);

  let child = null;

  if (figure) {
    const figureAllProps = { ...figure, ...figureProps };
    const figureComponentName = capitalize(figure.type);

    const FigureComponent = Figures[figureComponentName] || Figure;

    child = <FigureComponent {...figureAllProps} />;
  }

  return (
    <div
      className={`chessboard-cell${highlighted ? ' cell-highlighted' : ''}`}
      style={{ backgroundColor }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => highlighted && moveFigure(parseInt(e.dataTransfer.getData('text'), 10), index)}
    >
      {child}
    </div>
  );
};
