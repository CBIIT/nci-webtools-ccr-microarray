import React, { Component } from 'react';
import {Select } from 'antd';
import ReactSVG from 'react-svg'

const Option = Select.Option;

class PrePlotsBox extends Component {


	componentDidMount() {
	    // When the component is mounted, add your DOM listener to the elem.
	    // (The "nv" elem is assigned in the render function.)
	   	document.getElementById("tag3").addEventListener("mouseover", function(e){
    	if(e.target.localName === "use"){
    		let words = e.target.parentElement.cloneNode(true);
    		let defs =e.target.parentElement.parentElement.parentElement.childNodes[1].cloneNode(true)
    		var last_o_y=0;
    		var last_t_y=0;
    		for(let i = words.children.length-1; i>=0; i--){
    			console.log(1)
    			// change x and y accordinate
    			words.children[i].setAttribute("x",20);
    			if(last_o_y===0){
    				// the last element
    				last_o_y=words.children[i].getAttribute("y");
    				last_t_y=20;
    				words.children[i].setAttribute("y",20);
    			}else{
    				let diff = words.children[i].getAttribute("y")-last_o_y;
    				last_o_y=words.children[i].getAttribute("y");
					words.children[i].setAttribute("y",last_t_y+diff);
					last_t_y=last_t_y+diff
    			}
    		}

    		if(document.getElementById('tag3-tooltip-defs').firstChild!==null){
			document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
			}
			document.getElementById('tag3-tooltip-defs').appendChild(defs);
			if(document.getElementById('tag3-tooltip-svg').firstChild!==null){
	    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
			}
    		document.getElementById('tag3-tooltip-svg').appendChild(words);
	    	}
		});

  	}

	constructor(props){
		super(props);
		 this.state = {boxplot:""};

		this.handleSelectionChange = this.handleSelectionChange.bind(this);
	}

	handleSelectChange = (key) => {
	  console.log(key);
	}


	handleSelectionChange(value) {

		// shw the svg independently to solve the problem of svg confilction 

		let link2 ="./images/"+this.props.data.projectID+this.props.data.BoxplotBN;

	    let link3 = "./images/"+this.props.data.projectID+this.props.data.RLEplotBN;

	 	let link4="./images/"+this.props.data.projectID+this.props.data.NUSEplotBN;


	 	var list = document.getElementsByClassName("plot2");
		for (var i = 0; i < list.length; i++) {
				list[i].classList.add("hide");
		}
		if(document.getElementById('tag3-tooltip-defs').firstChild!==null){
			document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
		}

		if(document.getElementById('tag3-tooltip-svg').firstChild!==null){
    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
		}

	 	if(value==="tag5"){
	 		this.setState({boxplot:link4});
	 	}

	 	if(value==="tag4"){
	 		this.setState({boxplot:link3});
	 	}

	 	if(value==="tag3"){
	 		this.setState({boxplot:link2});
	 	}

	 	 if(value!=="tag5"&&value!=="tag3"&&value!=="tag4"){
	 	 	document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");
	 		
	 	}else{
	 		document.getElementById("tag3").className= document.getElementById("tag3").className.replace("hide", "");
	 	}

		}

// HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost
   
 render() {

 	let content =""; 

 	if(typeof(this.props.data.HistplotBN)!=="undefined"){
 		var histplotBNLink = './images/'+this.props.data.projectID+this.props.data.HistplotBN;
 
	 	const histplotBN =<img src= {histplotBNLink}  style={{width:"75%"}} alt="Histogram"/>;


	 	var list_mAplotBN=[];
	 	for (var i = this.props.data.MAplotBN.length - 1; i >= 0; i--) {
	 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotBN[i]
	 		list_mAplotBN.push(<div><img src={link} style={{width:"75%"}} alt="MAplot"/></div>)
	 	}


	
	    var maplot_style = 	{
	    						'height':'auto',
	  						  	'maxHeight':'100%',
	  						  	'overflow':'scroll'
	  						 };

	  let tooltip = {
						"position": "absolute",
					    "background": "white",
					    "left": "526px"
					}
		let tooltip_svg_div={
					   "transform": "rotate(90deg)",
					   "position": "absolute",
					   "top": "-365px",
					   "left": "-125px"
					}

		let tooltip_svg_title={
						"paddingTop": "20px"
					}

		let tabs =[ <div id="tag1" className="plot2">{histplotBN}</div>,
	  				<div id="tag2" className="plot2 hide" style={maplot_style}>{list_mAplotBN}</div>,
	  	    		<div id="tag3" className="plot2 hide">
	  	    		<div id="tag3-tooltip" style={tooltip}>
							<div id="tag3-tooltip-svg-title" style={tooltip_svg_title}>Point :</div>
							<div id="tag3-tooltip-svg-div">
							<svg style={tooltip_svg_div} 
								 xmlns="http://www.w3.org/2000/svg"
								 xmlnsXlink="http://www.w3.org/1999/xlink" 
								 width="40pt" 
								 height="600pt" 
								 viewBox="0 0 40 600" 
								 version="1.1" >
								 <defs id="tag3-tooltip-defs">  </defs>
								 <g id="tag3-tooltip-svg">  </g>
							</svg>
							</div>
							</div>
							<ReactSVG  
	  						path={this.state.boxplot}  
	  						renumerateIRIElements={false}
						 	svgClassName="svg-class-name"
						 	className="wrapper-class-name"/>

					</div>]

	  	content = [<Select defaultValue="tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
						      <Option  key="tag1" value="tag1">Histogram</Option>
						      <Option  key="tag2" value="tag2">MAplots</Option>
						      <Option  key="tag3" value="tag3">Boxplots</Option>
						      <Option  key="tag4" value="tag4">RLE</Option>
						      <Option  key="tag5" value="tag5">NUSE</Option>
						    </Select>,tabs]
 	}else{

 		let tabs =[ <div id="tag1" className="plot2">No data for Histogram  </div>,
	  				<div id="tag2" className="plot2 hide">No data for MAplots </div>,
	  	    		<div id="tag3" className="plot2 hide">No data for Boxplots</div>,
	  	   		    <div id="tag4" className="plot2 hide">No data for RLE</div>,
	  	   		    <div id="tag5" className="plot2 hide">No data for NUSE</div>]

	  	content = [<Select defaultValue="tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
						      <Option key="tag1" value="tag1">Histogram</Option>
						      <Option key="tag2" value="tag2">MAplots</Option>
						      <Option key="tag3" value="tag3">Boxplots</Option>
						      <Option key="tag4" value="tag4">RLE</Option>
						      <Option key="tag5" value="tag5">NUSE</Option>
						    </Select>,tabs]
 	}
 	return(
		  <div>
		    {content}
		  </div>
  		)
	}
}

export default PrePlotsBox;