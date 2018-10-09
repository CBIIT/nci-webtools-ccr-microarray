import React, { Component } from 'react';
import ReactSVG from 'react-svg'
import { Select, message } from 'antd';
import Plot from 'react-plotly.js';


const Option = Select.Option;

class PrePlotsBox extends Component {

    constructor(props) {
        super(props);
        this.state = { content: "No Data" };
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleSelectionChange("Histogram")
    }

    handleSelectionChange(value) {
        if (value == "Histogram") {
            this.upateCurrentWorkingTabAndObject("getHistplotBN")
            this.state = { content: this.props.data.HistplotBN };
        }
        if (value == "MAplots") { // 
            this.upateCurrentWorkingTabAndObject("getMAplotsBN")
            this.state = { content: this.props.data.MAplotsBN };
        }
        if (value == "Boxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotBN");
            this.state = { content: this.props.data.BoxplotBN };
        }
        if (value == "RLE") { // 

            this.props.upateCurrentWorkingTabAndObject("getRLE")
            this.state = { content: this.props.data.RLE };
        }
        if (value == "NUSE") {
            this.upateCurrentWorkingTabAndObject("getNUSE")
            this.state = { content: this.props.data.NUSE };
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