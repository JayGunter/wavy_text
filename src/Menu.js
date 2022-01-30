import React from 'react';
import WaveText from './WaveText.js';

export default class Menu extends React.Component {
  render() {
    let menus = ['jay@gunter.io xxx',
      'Software Engineer',
      '831-331-9434',
      'RowJO',
      '<b>Bolded text with some <i>italics</i>.</b>',	
      'Here is some text with a <span style="color: orange">span tag</span> inside.',	
			'All the whos down in <i>Whoville</i> liked Christmas a lot.',
			'']
    return ( 

      <div>
        {menus.map((v,i) => {
          return <a href="#" style={{textDecoration: 'none'}} key={i}>
						<WaveText 
							waveOnHover="true" 
							perStepMS="25-85" 
							onMountWaveDelayMS="3000" 
							periodicWaveDelayMS="9000" 
							style={{ fontSize: '40px'}}
						>
							{v}
						</WaveText>
					</a>
        })}
      </div>
    )
  }
}



//ReactDOM.render(<Menu />, document.getElementById('menu'))
