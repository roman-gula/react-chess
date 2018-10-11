import React from 'react';
import '../styles/color-palettes.css';

const PALETTES = [
  ['#FFFFFF', '#666666'],
  ['#FFFFFF', '#BF7F40'],
  ['#EBEBEB', '#7C91BE'],
  ['#FFFFE0', '#556B2F'],
  ['#DEE3E6', '#8CA2AD'],
  ['#ECCCA2', '#773210'],
  ['#FFCB00', '#777777'],
  ['#EFF0F2', '#145782'],
  ['#E0C068', '#B87030'],
  ['#FFFFFF', '#00A6AC']
];

export default ({ setPalette, palette }) => {
  if (!palette) setPalette(PALETTES[0]);

  return (
    <ul className="color-list">
      {PALETTES.map((item, index) => (
        <li key={index}>
          <input id={index + 1} name="palette-colors" type="radio" onChange={() => setPalette(item)} checked={item === palette} />
          <label htmlFor={index + 1}>
            <i style={{ backgroundColor: item[0] }}> </i>
            <i style={{ backgroundColor: item[1] }}> </i>
          </label>
        </li>
      ))}
    </ul>
  );
};
