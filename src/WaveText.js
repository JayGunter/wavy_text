import React from 'react';


// WaveText - React component yielding a <span> tag containing the value of the 'html' property.  
// OnMouseOver causes the inner text/html to ripple vertically.
// Props: 
//		waveOnHover="true"					// should text wave on mouseover?  default: "true"
//		onMountWaveDelayMS="3000"		// millisecs after mount for non-hover wave.  default: no wave occurs on mount
//		periodicWaveDelayMS="3000"	// millisecs after mount for periodic waves.  default: no periodic wave occurs
//		periods="3"									// number of periodic waves.  default: no periodic wave occurs
//		perStepMS="25-85"						// millisecs per step in the wave; single value or range; smaller value for faster ripple.  default: 55
//		color												// color of the html while rippling.  default: no color change on text wave
//		style												// standard HTML style attrs for <div> and <span> tags.  default: no styles
class WaveText extends React.Component {
	constructor(props) {
		super(props);
//console.log(props);
		let millis = this.props.perStepMS;
		if (!millis) millis = 55;
		let origInnerHTML = "";
		React.Children.forEach(this.props.children, (child) => { origInnerHTML += child; });
		this.state = { jumpUp: true, origInnerHTML: origInnerHTML, html: origInnerHTML, perStepMS: millis };
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.jump = this.jump.bind(this);
		this.ms(this.props.perStepMS);

		//console.log(this.props.periodicWaveDelayMS);
		if (this.props.periodicWaveDelayMS) {
			let jumper = setInterval(() => {
					if (this.state.afterHelloWave) {
						//console.log("burp ");
						this.jump(1);
					}
				},
				this.props.periodicWaveDelayMS);
		}
	}

	randomBetween(lower, upper) {
		const r = lower + Math.floor((upper - lower) * Math.random());
		//console.log("r="+r);
		return r;
	}

	ms(propVal) {
		//console.log("propVal="+propVal);
		if (!propVal) return 0;
		const vals = propVal.split("-");
		if (vals.length === -1) return propVal;
		const r = this.randomBetween(+vals[0], +vals[1]);
		return r;
	}

	handleMouseOver(event) {
		if (!this.props.waveOnHover) return;
		//var target = event.target || event.srcElement;
    let tar = event.currentTarget,
			width = tar.offsetWidth,
			left = tar.offsetLeft,
			text = tar.innerText;
//console.log("text="+text);
			const chIndex = Math.round( (event.screenX - left) / (width) * text.length);
    //console.log("w="+width+", l="+left+", e.x="+event.screenX+", t.l="+text.length+", chIndex="+chIndex);
			this.jump(chIndex);
	}

	jump(chIndex) {
		let s = this.state.html;
//console.log("s="+s+", chIndex="+chIndex);
    if (s.includes("WaveText")) return;	// Already having fun with this link.
    let 
			i = 0,
			slen = s.length,
			chSteps = new Array(slen).fill(0);	// for each ch, store the index of its yDisplacement 
    let yDisplacements = [0,1,2,4,8,12,20],
			yDlen = yDisplacements.length;
    chSteps[chIndex] = 1; 

    let jumper = setInterval(() => {
			let inner = "",
				active = false;
			// bump the step counter (chSteps) for each char.  When 1 we are at the current edge of the ripple.
			for (let n = chIndex; n >= 0 && ++chSteps[n] !== 1; n--);
			for (let n = chIndex + 1; n < slen && ++chSteps[n] !== 1; n++);
//console.log("slen="+slen);
			let tagLevel = 0;
			let tag = "";
			for (let n = i = 0; n < slen; n++) {
				let ch = s.charAt(n);
				if (ch === "<" || ch === ">" || tagLevel > 0) {
					tag += ch;
					if (ch === "<") tagLevel++;
					if (ch === ">") tagLevel--;
					continue;
				}
				if (tag !== "") {
					inner += tag;
					tag = "";
				}

				let step = chSteps[i];
				let d = 0;
				if (step < yDlen) {
					d = yDisplacements[step];
				} else if (step === yDlen) {
					d = yDisplacements[step - 1];
				} else if (step > 2 * yDlen) {
					d = yDisplacements[0];
				} else {
					d = yDisplacements[yDlen - (step - yDlen)];
				}
//console.log("n="+n+"i="+i+", ch="+ch+", step="+step+", d="+d);
				if (d > 0) active = true;
				let colorStyle = ""; //this.props.color ?  "color: " + (this.props.color) : "";
				inner += "<span name='WaveText' style='position: relative; top: " + ((this.state.jumpUp ? -1 : 1) * d) + "px; " + colorStyle + ";'>" + ch + "</span>";
				i++;
			}
			this.setState( { html: inner } );
			if (! active) {
				clearInterval(jumper);
				this.setState( { 
					jumpUp: !this.state.jumpUp,
					html: this.state.origInnerHTML } );
			}
    },
    this.ms(this.state.perStepMS));
	}

  componentDidMount() {
		//console.log(this.props.onMountWaveDelayMS);
		if (!this.props.onMountWaveDelayMS) return;
    let jumper = setInterval(() => {
		//console.log("hello");
				//this.jump(randomBetween(1,);
				this.jump(1);
				this.setState({ afterHelloWave: true });
				clearInterval(jumper);
			},
			this.props.onMountWaveDelayMS);
  }

  render() {
    return <div style={this.props.style}><span 
				onMouseOver={((event) => {this.handleMouseOver(event);})} 
				onClick={((event) => {alert("click");})} 
				dangerouslySetInnerHTML={{ __html: this.state.html }} >
      </span><p/></div>
  }
}

export default WaveText;
