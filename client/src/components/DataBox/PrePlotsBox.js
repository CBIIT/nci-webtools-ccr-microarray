import React, { Component } from 'react';
import ReactSVG from 'react-svg'
import { Select, message } from 'antd';
import Plot from 'react-plotly.js';


const Option = Select.Option;

class PrePlotsBox extends Component {

    constructor(props) {
        super(props);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
       
    }

    componentDidMount() {
         this.handleSelectionChange("Histogram")
    }

    handleSelectionChange(value) {
        if (value == "Histogram") {
            this.props.upateCurrentWorkingTabAndObject("getHistplotBN");
            this.props.getHistplotBN();
            
        }
        if (value == "MAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotsBN");
            this.props.getMAplotsBN();
        }
        if (value == "Boxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotBN");
            this.props.getBoxplotBN();
        }
        if (value == "RLE") { // 
            this.props.upateCurrentWorkingTabAndObject("getRLE");
            this.props.getRLE();
     
        }
        if (value == "NUSE") {
            this.props.upateCurrentWorkingTabAndObject("getNUSE")
            this.props.getNUSE();

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
                        </Select>, this.props.data.preplots]



        return (<div > { content } </div>)
    }
}

export default PrePlotsBox;