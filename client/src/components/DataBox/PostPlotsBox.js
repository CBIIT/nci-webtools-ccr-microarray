import React, { Component } from 'react';
import {Select } from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';

const Option = Select.Option;


class PostPlotsBox extends Component {


	constructor(props){
		super(props);

		 if (typeof(this.props.data.HistplotAN) !== "undefined") {
                 let histplotANLink = './images/'+this.props.data.projectID+this.props.data.HistplotAN;
		 		 let histplotAN =<img style={{width:"75%"}} src= {histplotANLink} alt={"Histogram"}/>;
                 this.state = { content : histplotAN };
        }else{

             this.state = { content : "No Data" };
        }
       

        this.handleSelectionChange = this.handleSelectionChange.bind(this);


	}



	handleSelectChange = (key) => {
	  console.log(key);
	}

	handleSelectionChange(value) {

		if(value=="Histogram"){ // 

		    let histplotANLink = './images/'+this.props.data.projectID+this.props.data.HistplotAN;
			let histplotAN =<img style={{width:"75%"}} src= {histplotANLink} alt={"Histogram"}/>;
		    this.state = { content : histplotAN };
		 }

         if(value=="MAplots"){ // 

         		let maplot_style={
		    						'height':'auto',
		  						  	'maxHeight':'100%',
		  						  	'overflow':'scroll'
		  						 };


               let list_mAplotAN=[];
			 	for (var i = this.props.data.MAplotAN.length - 1; i >= 0; i--) {
			 		var link = "./images/"+this.props.data.projectID+this.props.data.MAplotAN[i]
			 		list_mAplotAN.push(<div key={"mAplotAN"+i}><img src={link} style={{width:"75%"}} alt={"MAplots"}/></div>)
			 	}

                this.setState({ content: <div style={ maplot_style } > { list_mAplotAN } </div> });

        }

        if(value=="Boxplots"){ // 

           
            let BoxplotANRenderData =[]
            let BoxplotANsData = this.props.data.BoxplotAN
            for(let i = 0; i<this.props.data.BoxplotAN.col.length-1;i++){

                let boxplotData = {
                    y:BoxplotANsData.data[i],
                    type:"box",
                    name:BoxplotANsData.col[i],
                     marker:{
                      color: BoxplotANsData.color[i]
                    }
                }
                BoxplotANRenderData.push(boxplotData)
            }

           	let plot_layout ={showlegend: false,autosize:true}
            let plot_style= {}


            let Boxplots =<Plot  data={BoxplotANRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

             this.setState({ content: <div> {Boxplots}</div> });

                       

        }

        if(value=="PCA"){ // 

            let pcaData =this.props.data.PCA;
		    var PCAIframe =<Plot  data={[{

                x: pcaData.x,
                y: pcaData.y,
                z: pcaData.z,
                text: pcaData.row,
                mode: 'markers',
                marker: {
                    size: 10,
                    color: pcaData.color
                },
                type: 'scatter3d',
               
            }]} layout={{
            	autosize:true,
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 0
                },
                scene: {
                    xaxis: {
                        title: pcaData.col[0],
                        backgroundcolor: "#DDDDDD",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"

                    },
                    yaxis: {
                        title:  pcaData.col[1],
                        backgroundcolor: "#EEEEEE",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"
                    },
                    zaxis: {
                        title:  pcaData.col[2],
                        backgroundcolor: "#cccccc",
                        gridcolor: "rgb(255, 255, 255)",
                        showbackground: true,
                        zerolinecolor: "rgb(255, 255, 255)"
                    }
                }}
            }  useResizeHandler={true} />

            this.setState({ content: <div> {PCAIframe}</div> });
        }


        if(value=="Heatmap"){ // 

 			let HeatMapIframe = <div><iframe title={"Heatmap"} src={"./images/"+this.props.data.projectID+this.props.data.Heatmapolt}  width={'90%'} height={'90%'} frameBorder={'0'}/></div>

            this.setState({ content: <div>{HeatMapIframe}</div> });
        }
     }	

// HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost
   
 render() {

 	let content ="No Data"

 	if(typeof(this.props.data.HistplotAN)!=="undefined"){
			 
		   content = [<Select key="select_post_tag2" defaultValue="Histogram" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option key="opt_post_tag1" value="Histogram">Histogram</Option>
							      <Option key="opt_post_tag2" value="MAplots">MAplots</Option>
							      <Option key="opt_post_tag3" value="Boxplots">Boxplots</Option>
							      <Option key="opt_post_tag4" value="PCA">PCA</Option>
							      <Option key="opt_post_tag5" value="Heatmap">Heatmap</Option>
							    </Select>,this.state.content]

 	}

 	return(
		  <div>
		    {content}
		  </div>
  		)
	}
}

export default PostPlotsBox;