import React, { Component } from 'react';
import { Select } from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';


const Option = Select.Option;

class PrePlotsBox extends Component {



    constructor(props) {
        super(props);
        this.state = { boxplot: "" };

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
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

            let content = "";

            if (typeof(this.props.data.HistplotBN) !== "undefined") {

                var histplotBNLink = './images/' + this.props.data.projectID + this.props.data.HistplotBN;

                const histplotBN = <img src={ histplotBNLink } style={{ width: "75%" }} alt="Histogram" /> ;

                let list_mAplotBN = [];
                for (let i = this.props.data.MAplotBN.length-1; i >= 0; i--){
                    let link = "./images/" + this.props.data.projectID+this.props.data.MAplotBN[i]
                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img key={"mAplotBN"+i} src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                    }

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

            let Boxplots =<Plot key="BoxPlotBN"  data={BoxplotRenderData}
            layout={{title: 'BoxPlot'}}/>



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



            let RLE =<Plot key="RLEBN" data={RLERenderData}
            layout={{title: 'RLE Plot'}}/>



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



            let NUSE =<Plot key="NUSEBN" data={NUSERenderData}
            layout={{title: 'NUSE Plot'}}/>



                    let  maplot_style={
                        'height': 'auto',
                        'maxHeight': '100%',
                        'overflow': 'scroll'
                    };



                    let tabs = [ <div id="tag1" key="tag1" className="plot2" > { histplotBN } </div>,
                        <div id="tag2" key="tag2"  className="plot2 hide" style={ maplot_style } > { list_mAplotBN } </div>, 
                        <div id="tag3" key="tag3"  className="plot2 hide"> {Boxplots}</div>,
                        <div id="tag4" key="tag4"  className="plot2 hide"> {RLE} </div>,
                        <div id="tag5" key="tag5"  className="plot2 hide"> {NUSE} </div>
                    ]

                    content = [ <Select key="select-pre-plots" defaultValue="tag1"
                        style = { { width: 240 } } onChange={ this.handleSelectionChange } >
                        <Option key="opt-tag1" value="tag1" > Histogram </Option> 
                        <Option key="opt-tag2" value="tag2" > MAplots </Option>
                        <Option key="opt-tag3" value="tag3" > Boxplots </Option> 
                        <Option key="opt-tag4" value="tag4" > RLE </Option> 
                        <Option key="opt-tag5" value="tag5" > NUSE </Option> 
                        </Select>,tabs]
                    }
                    else {

                        let tabs = [ 
                        <div id="tag1" key="tag1" className="plot2" > No data for Histogram </div>, 
                        <div id="tag2" key="tag2" className="plot2 hide" > No data for MAplots </div>, 
                        <div id="tag3" key="tag3" className="plot2 hide" > No data for Boxplots </div>, 
                        <div id="tag4" key="tag4" className="plot2 hide" > No data for RLE </div>, 
                        <div id="tag5" key="tag5" className="plot2 hide" > No data for NUSE </div>]

                    content = [ <Select key="select-pre-plots"  defaultValue="tag1" style={ { width: 240 } } onChange={ this.handleSelectionChange } >
                                <Option key="opt-tag1" value="tag1" > Histogram </Option>
                                <Option key="opt-tag2" value="tag2" > MAplots </Option>
                                <Option key="opt-tag3" value="tag3" > Boxplots </Option> 
                                <Option key="opt-tag4" value="tag4" > RLE </Option>
                                <Option key="opt-tag5" value="tag5" > NUSE </Option>
                                </Select>,tabs]
                            }
                            return ( <div > { content } </div>
                            )
                        }
                    }

export default PrePlotsBox;