import React, { Component } from 'react';
import {Select } from 'antd';
import ReactSVG from 'react-svg'

const Option = Select.Option;


class PostPlotsBox extends Component {


	constructor(props){
		super(props);
	}



	componentDidMount() {
	    // When the component is mounted, add your DOM listener to the elem.
	    // (The "nv" elem is assigned in the render function.)
	   	document.getElementById("tag3").addEventListener("mouseover", function(e){
    	if(e.target.localName == "use"){
    		let words = e.target.parentElement.cloneNode(true);
    		let defs =e.target.parentElement.parentElement.parentElement.childNodes[1].cloneNode(true)
    		let top = e.target.getAttribute("y");
    		var last_o_y=0;
    		var last_t_y=0;
    		for(let i = words.children.length-1; i>=0; i--){
    			console.log(1)
    			// change x and y accordinate
    			words.children[i].setAttribute("x",20);
    			if(last_o_y==0){
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
    		document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
    		document.getElementById('tag3-tooltip-defs').appendChild(defs);
    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
    		document.getElementById('tag3-tooltip-svg').appendChild(words);
	    	}
		});

  	}



	handleSelectChange = (key) => {
	  console.log(key);
	}

	handleSelectionChange(value) {
		  var list = document.getElementsByClassName("plot");
		  for (var i = 0; i < list.length; i++) {
				list[i].classList.add("hide");
			}
		  document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");
		}	

// HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost
   
 render() {

 	let content =""

 	if(typeof(this.props.data.HistplotAN)!="undefined"){
			var histplotANLink = './images/'+this.props.data.projectID+this.props.data.HistplotAN;
		 

		 	const histplotAN =<img style={{width:"75%"}} src= {histplotANLink}/>;

		 	var list_mAplotAN=[];
		 	for (var i = this.props.data.MAplotAN.length - 1; i >= 0; i--) {
		 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotAN[i]
		 		list_mAplotAN.push(<div><img src={link} style={{width:"75%"}} /></div>)
		 	}

		 	var link2 ="./images/"+this.props.data.projectID+this.props.data.BoxplotAN;
		 	var boxplotAN =<ReactSVG path={link2} style={{width:"75%"}} />;

		    var PCAIframe = <div><iframe src={"./images/"+this.props.data.projectID+this.props.data.PCA}  width={'105%'} height={'65%'} style={{'overflow':'hidden'}} frameBorder={'0'}/></div>


		    var HeatMapIframe = <div><iframe src={"./images/"+this.props.data.projectID+this.props.data.Heatmapolt}  width={'90%'} height={'90%'} frameBorder={'0'}/></div>


		     var maplot_style = 	{
	    						'height':'auto',
	  						  	'max-height':'100%',
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
							"padding-top": "20px"
						}


		    var maplot_style = 	{
		    						'height':'auto',
		  						  	'max-height':'100%',
		  						  	'overflow':'scroll'
		  						 };
		 	let tabs =[ <div id="post_tag1" className="plot">
		  							{histplotAN}
		  						</div>,
		  						  <div id="post_tag2" className="plot hide" style={maplot_style}>{list_mAplotAN}</div>,
		  						  <div id="post_tag3" className="plot hide">
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
											{boxplotAN}
									</div>,
		  						  <div id="post_tag4" className="plot hide">{PCAIframe}</div>,
		  						  <div id="post_tag5" className="plot hide">{HeatMapIframe}</div>]

		   content = [<Select defaultValue="post_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="post_tag1">Histogram</Option>
							      <Option value="post_tag2">MAplots</Option>
							      <Option value="post_tag3">Boxplots</Option>
							      <Option value="post_tag4">PCA</Option>
							      <Option value="post_tag5">Heatmap</Option>
							    </Select>,tabs]

 		}else{

 				let tabs =[ <div id="post_tag1" className="plot">
		  							No data for Histogram
		  						</div>,
		  						  <div id="post_tag2" className="plot hide" >No data for MAplots</div>,
		  						  <div id="post_tag3" className="plot hide">No data for Boxplots</div>,
		  						  <div id="post_tag4" className="plot hide">No data for 3DPCA</div>,
		  						  <div id="post_tag5" className="plot hide">No data for HeatMap</div>]

		   		content = [<Select defaultValue="post_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="post_tag1">Histogram</Option>
							      <Option value="post_tag2">MAplots</Option>
							      <Option value="post_tag3">Boxplots</Option>
							      <Option value="post_tag4">PCA</Option>
							      <Option value="post_tag5">Heatmap</Option>
							    </Select>,tabs]

 		}
 	
					 

 	return(
		  <div>
		    {content}
		  </div>
  		)
	}
}

export default PostPlotsBox;