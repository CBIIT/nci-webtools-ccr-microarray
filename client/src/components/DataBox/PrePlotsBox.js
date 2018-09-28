import React, { Component } from 'react';
import ReactSVG from 'react-svg'
import {Select } from 'antd';
import Plot from 'react-plotly.js';


const Option = Select.Option;

class PrePlotsBox extends Component {



    constructor(props) {
        super(props);
        if (typeof(this.props.data.HistplotBN) !== "undefined") {
                 let histplotBNLink = './images/' + this.props.data.projectID + this.props.data.HistplotBN;
                 let histplotBN = <img src={ histplotBNLink } style={{ width: "75%" }} alt="Histogram" /> ;
                 this.state = { content : histplotBN };
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

             let histplotBNLink = './images/' + this.props.data.projectID + this.props.data.HistplotBN;
             let histplotBN = <img src={ histplotBNLink } style={{ width: "75%" }} alt="Histogram" /> ;
             this.setState({ content: <div> {histplotBN}</div> });
        }

         if(value=="MAplots"){ // 
                let list_mAplotBN = [];
                for (let i = this.props.data.MAplotBN.length-1; i >= 0; i--){
                    let link = "./images/" + this.props.data.projectID+this.props.data.MAplotBN[i]
                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                    }


                let  maplot_style={
                        'height': 'auto',
                        'maxHeight': '100%',
                        'overflow': 'scroll'
                  };

                this.setState({ content: <div style={ maplot_style } > { list_mAplotBN } </div> });

        }

        if(value=="Boxplots"){ // 


               
            let BoxplotRenderData =[]
            let BoxplotsData = this.props.data.BoxplotBN
            for(let i = 0; i<this.props.data.BoxplotBN.col.length-1;i++){

                let boxplotData = {
                    y:BoxplotsData.data[i],
                    type:"box",
                    name:BoxplotsData.col[i],
                     marker:{
                      color: BoxplotsData.color[i]
                    }
                }
                BoxplotRenderData.push(boxplotData)
            }

            let plot_layout ={showlegend: false,autosize:true}
            let plot_style= {}

            let Boxplots =<Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

             this.setState({ content: <div> {Boxplots}</div> });

                       

        }

        if(value=="RLE"){ // 


            let RLERenderData =[]
            let RLEplotsData = this.props.data.RLEplotBN
            for(let i = 0; i<this.props.data.RLEplotBN.col.length-1;i++){

                let boxplotData = {
                    y:RLEplotsData.data[i],
                    type:"box",
                    name:RLEplotsData.col[i],
                     marker:{
                      color: RLEplotsData.color[i]
                    }
                }
                RLERenderData.push(boxplotData)
            }


            let plot_layout ={showlegend: false,autosize:true}
            let plot_style= {}

            let RLE =<Plot data={RLERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

             this.setState({ content: <div> {RLE}</div> });
        }
        if(value=="NUSE"){ // 


            let NUSERenderData =[]
            let NUSEplotsData = this.props.data.NUSEplotBN
            for(let i = 0; i<this.props.data.NUSEplotBN.col.length-1;i++){

                let boxplotData = {
                    y:NUSEplotsData.data[i],
                    type:"box",
                    name:NUSEplotsData.col[i],
                     marker:{
                      color: NUSEplotsData.color[i]
                    }
                }
                NUSERenderData.push(boxplotData)
            }

            let plot_layout ={showlegend: false,autosize:true}
            let plot_style= {}

            let NUSE =<Plot  data={NUSERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

              this.setState({ content: <div> {NUSE}</div> });
        }
      
    
    }

    // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

    render() {

            let content = "No Data";

            if (typeof(this.props.data.HistplotBN) !== "undefined") {

                    content = [ <Select key="select-pre-plots" defaultValue="Histogram"
                        style = { { width: 240 } } onChange={ this.handleSelectionChange } >
                        <Option key="opt-tag1" value="Histogram" > Histogram </Option> 
                        <Option key="opt-tag2" value="MAplots" > MAplots </Option>
                        <Option key="opt-tag3" value="Boxplots" > Boxplots </Option> 
                        <Option key="opt-tag4" value="RLE" > RLE </Option> 
                        <Option key="opt-tag5" value="NUSE" > NUSE </Option> 
                        </Select>,this.state.content]
               }

                        
            return ( <div > { content } </div>)
         }           
}

export default PrePlotsBox;