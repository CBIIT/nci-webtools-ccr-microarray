import React, { Component } from 'react';
import {Select } from 'antd';

const Option = Select.Option;


class PostPlotsBox extends Component {


	constructor(props){
		super(props);
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
		 

		 	const histplotAN =<img src= {histplotANLink}/>;

		 	var list_mAplotAN=[];
		 	for (var i = this.props.data.MAplotAN.length - 1; i >= 0; i--) {
		 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotAN[i]
		 		list_mAplotAN.push(<div><img src={link} style={{width:"100%"}}/></div>)
		 	}

		 	var link2 ="./images/"+this.props.data.projectID+this.props.data.BoxplotAN;
		 	var boxplotAN =<img src={link2}/>;

		    var PCAIframe = <div><iframe src={"http://localhost:9000/images/"+this.props.data.projectID+this.props.data.PCA}  width={'105%'} height={'65%'} style={{'overflow':'hidden'}} frameBorder={'0'}/></div>


		    var HeatMapIframe = <div><iframe src={"http://localhost:9000/images/"+this.props.data.projectID+this.props.data.Heatmapolt}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


		    var maplot_style = 	{
		    						'height':'auto',
		  						  	'max-height':'100%',
		  						  	'overflow':'scroll'
		  						 };
		 	let tabs =[ <div id="post_tag1" className="plot">
		  							{histplotAN}
		  						</div>,
		  						  <div id="post_tag2" className="plot hide" style={maplot_style}>{list_mAplotAN}</div>,
		  						  <div id="post_tag3" className="plot hide">{boxplotAN}</div>,
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