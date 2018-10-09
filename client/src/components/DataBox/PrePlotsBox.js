import React, { Component } from 'react';
import ReactSVG from 'react-svg'
import { Select,message } from 'antd';
import Plot from 'react-plotly.js';


const Option = Select.Option;

class PrePlotsBox extends Component {



    constructor(props) {
        super(props);
        this.state = { content: "No Data" };
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleSelectionChange("Histogram")
    }

    handleSelectChange = (key) => {
        console.log(key);
    }



    handleSelectionChange(value) {
        if (value == "Histogram") { // 

            this.props.upateCurrentWorkingTabAndObject("HistplotBN")
            try {
                fetch('./api/analysis/getHistplotAN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let histplotBNLink = './images/' + this.props.data.projectID + result.data;
                                let histplotBN = <img src={ histplotBNLink } style={{ width: "75%" }} alt="Histogram" />;
                                this.setState({ content: histplotBN });
                      
                            } else {

                                 this.setState({ content: "No Data" });
                      
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }

        if (value == "MAplots") { // 

            this.props.upateCurrentWorkingTabAndObject("MAplotsBN")
            try {
                fetch('./api/analysis/getMAplotsBN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let list_mAplotBN = [];
                                for (let i = result.data.length - 1; i >= 0; i--) {
                                    let link = "./images/" + this.props.data.projectID + result.data[i]
                                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                                }
                                let maplot_style = {
                                    'height': 'auto',
                                    'maxHeight': '100%',
                                    'overflow': 'scroll'
                                };

                                this.setState({ content: <div style={ maplot_style } > { list_mAplotBN } </div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }






        }

        if (value == "Boxplots") { // 

            this.props.upateCurrentWorkingTabAndObject("BoxplotBN");
            try {
                fetch('./api/analysis/getBoxplotBN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let BoxplotRenderData = []
                                let BoxplotsData = result.data
                                for (let i = 0; i < result.data.col.length - 1; i++) {

                                    let boxplotData = {
                                        y: BoxplotsData.data[i],
                                        type: "box",
                                        name: BoxplotsData.col[i],
                                        marker: {
                                            color: BoxplotsData.color[i]
                                        }
                                    }
                                    BoxplotRenderData.push(boxplotData)
                                }

                                let plot_layout = { showlegend: false, autosize: true }
                                let plot_style = {}

                                let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                                this.setState({ content: <div> {Boxplots}</div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }

        if (value == "RLE") { // 

            this.props.upateCurrentWorkingTabAndObject("RLE")
            try {
                fetch('./api/analysis/getRLE', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let RLERenderData = []
                                let RLEplotsData = result.data
                                for (let i = 0; i < result.data.col.length - 1; i++) {

                                    let boxplotData = {
                                        y: RLEplotsData.data[i],
                                        type: "box",
                                        name: RLEplotsData.col[i],
                                        marker: {
                                            color: RLEplotsData.color[i]
                                        }
                                    }
                                    RLERenderData.push(boxplotData)
                                }


                                let plot_layout = { showlegend: false, autosize: true }
                                let plot_style = {}

                                let RLE = <Plot data={RLERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                                this.setState({ content: <div> {RLE}</div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }



        }


        if (value == "NUSE") { // 

            this.props.upateCurrentWorkingTabAndObject("NUSE")
            try {
                fetch('./api/analysis/getNUSE', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {

                            let NUSERenderData = []
                            let NUSEplotsData = result.data
                            for (let i = 0; i < result.data.col.length - 1; i++) {

                                let boxplotData = {
                                    y: NUSEplotsData.data[i],
                                    type: "box",
                                    name: NUSEplotsData.col[i],
                                    marker: {
                                        color: NUSEplotsData.color[i]
                                    }
                                }
                                NUSERenderData.push(boxplotData)
                            }

                            let plot_layout = { showlegend: false, autosize: true }
                            let plot_style = {}

                            let NUSE = <Plot  data={NUSERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                            this.setState({ content: <div> {NUSE}</div> });


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }


    }

    // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

    render() {

        let content = [<Select key="select-pre-plots" defaultValue="Histogram"
                        style = { { width: 240 } } onChange={ this.handleSelectionChange } >
                        <Option key="opt-tag1" value="Histogram" > Histogram </Option> 
                        <Option key="opt-tag2" value="MAplots" > MAplots </Option>
                        <Option key="opt-tag3" value="Boxplots" > Boxplots </Option> 
                        <Option key="opt-tag4" value="RLE" > RLE </Option> 
                        <Option key="opt-tag5" value="NUSE" > NUSE </Option> 
                        </Select>, this.state.content]
 


        return (<div > { content } </div>)
    }
}

export default PrePlotsBox;