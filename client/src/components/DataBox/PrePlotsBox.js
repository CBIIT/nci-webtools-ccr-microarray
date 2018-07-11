import React, { Component } from 'react';
import {Select } from 'antd';

const Option = Select.Option;

class PrePlotsBox extends Component {


	constructor(props){
		super(props);
	}

	handleSelectChange = (key) => {
	  console.log(key);
	}


	handleSelectionChange(value) {
		  var list = document.getElementsByClassName("plot2");
		  for (var i = 0; i < list.length; i++) {
				list[i].classList.add("hide");
			}
		  document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");
		}

// HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost
   
 render() {

 	let content =""; 

 	if(typeof(this.props.data.HistplotBN)!="undefined"){
 		var histplotBNLink = './images/'+this.props.data.projectID+this.props.data.HistplotBN;
 
	 	const histplotBN =<img src= {histplotBNLink}/>;


	 	var list_mAplotBN=[];
	 	for (var i = this.props.data.MAplotBN.length - 1; i >= 0; i--) {
	 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotBN[i]
	 		list_mAplotBN.push(<div><img src={link} style={{width:"100%"}}/></div>)
	 	}


	 	var link2 ="./images/"+this.props.data.projectID+this.props.data.BoxplotBN;
	 	var boxplotBN =<img src={link2}/>;

	    var link3 = "./images/"+this.props.data.projectID+this.props.data.RLEplotBN;
	 	var rleplotBN=<img src={link3} style={{width:"100%"}}/>;

	 	var link4="./images/"+this.props.data.projectID+this.props.data.NUSEplotBN;
	 	var nusplotBN=<img src={link4}/>;


	    var maplot_style = 	{
	    						'height':'auto',
	  						  	'max-height':'100%',
	  						  	'overflow':'scroll'
	  						 };
		let tabs =[ <div id="tag1" className="plot2">{histplotBN}</div>,
	  				<div id="tag2" className="plot2 hide" style={maplot_style}>{list_mAplotBN}</div>,
	  	    		<div id="tag3" className="plot2 hide">{boxplotBN}</div>,
	  	   		    <div id="tag4" className="plot2 hide">{rleplotBN}</div>,
	  	   		    <div id="tag5" className="plot2 hide">{nusplotBN}</div>]

	  	content = [<Select defaultValue="tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
						      <Option value="tag1">Histogram</Option>
						      <Option value="tag2">MAplots</Option>
						      <Option value="tag3">Boxplots</Option>
						      <Option value="tag4">RLE</Option>
						      <Option value="tag5">NUSE</Option>
						    </Select>,tabs]
 	}else{

 		let tabs =[ <div id="tag1" className="plot2">No data for Histogram  </div>,
	  				<div id="tag2" className="plot2 hide">No data for MAplots </div>,
	  	    		<div id="tag3" className="plot2 hide">No data for Boxplots</div>,
	  	   		    <div id="tag4" className="plot2 hide">No data for RLE</div>,
	  	   		    <div id="tag5" className="plot2 hide">No data for NUSE</div>]

	  	content = [<Select defaultValue="tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
						      <Option value="tag1">Histogram</Option>
						      <Option value="tag2">MAplots</Option>
						      <Option value="tag3">Boxplots</Option>
						      <Option value="tag4">RLE</Option>
						      <Option value="tag5">NUSE</Option>
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