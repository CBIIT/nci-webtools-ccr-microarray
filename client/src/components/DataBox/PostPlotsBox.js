import React, { Component } from 'react';
import {Select } from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';

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

 	if(typeof(this.props.data.HistplotAN)!=="undefined"){
			var histplotANLink = './images/'+this.props.data.projectID+this.props.data.HistplotAN;
		 

		 	const histplotAN =<img style={{width:"75%"}} src= {histplotANLink} alt={"Histogram"}/>;

		 	var list_mAplotAN=[];
		 	for (var i = this.props.data.MAplotAN.length - 1; i >= 0; i--) {
		 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotAN[i]
		 		list_mAplotAN.push(<div><img src={link} style={{width:"75%"}} alt={"MAplots"}/></div>)
		 	}






            let BoxplotANRenderData =[]
            let BoxplotANData = this.props.data.BoxplotAN
            for(let i = 0; i<this.props.data.BoxplotAN.col.length-1;i++){

                let boxplotData = {
                    y:BoxplotANData.data[i],
                    type:"box",
                    name:BoxplotANData.col[i],
                     marker:{
                      color: BoxplotANData.color[i]
                    }
                }
                BoxplotANRenderData.push(boxplotData)
            }

            let boxplotAN =<Plot key="BoxPlotAN"  data={BoxplotANRenderData}
            layout={{title: 'BoxPlot'}}/>


            let pcaData =this.props.data.PCA;
		    var PCAIframe =<Plot data={[{
                x: pcaData.x,
                y: pcaData.y,
                z: pcaData.z,
                text: pcaData.row,
                mode: 'markers+text',
                marker: {
                    size: 10,
                    color: pcaData.color
                },
                type: 'scatter3d',
               
            }]} layout={{
                title:'This is a test plot',
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 0
                },
                scene: {
                    xaxis: {
                        title: pcaData.col[1],
                        backgroundcolor: "#DDDDDD",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"

                    },
                    yaxis: {
                        title:  pcaData.col[2],
                        backgroundcolor: "#EEEEEE",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"
                    },
                    zaxis: {
                        title:  pcaData.col[3],
                        backgroundcolor: "#cccccc",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"
                    }
                }}
            } />





		    let HeatMapIframe = <div><iframe title={"Heatmap"} src={"./images/"+this.props.data.projectID+this.props.data.Heatmapolt}  width={'90%'} height={'90%'} frameBorder={'0'}/></div>

		   
		    let maplot_style = 	{
		    						'height':'auto',
		  						  	'max-height':'100%',
		  						  	'overflow':'scroll'
		  						 };
		 	let tabs =[ <div key="post_tag1" id="post_tag1" className="plot">
		  							{histplotAN}
		  						</div>,
		  						  <div key="post_tag2" id="post_tag2" className="plot hide" style={maplot_style}>{list_mAplotAN}</div>,
		  						  <div key="post_tag3" id="post_tag3" className="plot hide">
											{boxplotAN}
									</div>,
		  						  <div key="post_tag4" id="post_tag4" className="plot hide">{PCAIframe}</div>,
		  						  <div key="post_tag5" id="post_tag5" className="plot hide">{HeatMapIframe}</div>]

		   content = [<Select key="select_post_tag2" defaultValue="post_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option key="opt_post_tag1" value="post_tag1">Histogram</Option>
							      <Option key="opt_post_tag2" value="post_tag2">MAplots</Option>
							      <Option key="opt_post_tag3" value="post_tag3">Boxplots</Option>
							      <Option key="opt_post_tag4" value="post_tag4">PCA</Option>
							      <Option key="opt_post_tag5" value="post_tag5">Heatmap</Option>
							    </Select>,tabs]

 		}else{

 				let tabs =[ <div key="post_tag1" id="post_tag1" className="plot">
		  							No data for Histogram
		  						</div>,
		  						  <div key="post_tag2" id="post_tag2" className="plot hide" >No data for MAplots</div>,
		  						  <div key="post_tag3" id="post_tag3" className="plot hide">No data for Boxplots</div>,
		  						  <div key="post_tag4" id="post_tag4" className="plot hide">No data for 3DPCA</div>,
		  						  <div key="post_tag5" id="post_tag5" className="plot hide">No data for HeatMap</div>]

		   		content = [<Select key="select_post_tag2" defaultValue="post_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option key="opt_post_tag1" value="post_tag1">Histogram</Option>
							      <Option key="opt_post_tag2" value="post_tag2">MAplots</Option>
							      <Option key="opt_post_tag3" value="post_tag3">Boxplots</Option>
							      <Option key="opt_post_tag4" value="post_tag4">PCA</Option>
							      <Option key="opt_post_tag5" value="post_tag5">Heatmap</Option>
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