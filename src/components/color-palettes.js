import React, { Component } from 'react';
import '../styles/color-palettes.css';

const PALETTES = [
	['#FFFFFF','#666666'],
	['#FFFFFF','#BF7F40'],
	['#EBEBEB','#7C91BE'],
	['#FFFFE0','#556B2F'],
	['#DEE3E6','#8CA2AD'],
	['#ECCCA2','#773210'],
	['#FFCB00','#777777'],
	['#EFF0F2','#145782'],
	['#E0C068','#B87030'],
	['#FFFFFF','#00A6AC']
];

class colorPalettes extends Component {
	constructor() {
		super(...arguments);

		this.props.setPalette(PALETTES[0]);
		this.state = { palette:PALETTES[0] };
	}
	onChange(palette) {
		this.props.setPalette(palette);
		this.setState({ palette });
	}

	render() {
		return <ul className="color-list">
			{
				PALETTES.map((palette, index) => {
					let id = index + 1;
					let checked = palette === this.state.palette;

					return <li key={index}>
						<input id={id} name="palette-colors" type="radio" onChange={() => this.onChange(palette)} checked={checked} />
						<label htmlFor={id}>
							<i style={{backgroundColor:palette[0]}}> </i>
							<i style={{backgroundColor:palette[1]}}> </i>
						</label>
					</li>
				})
			}
		</ul>
	}
}

export default colorPalettes;