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

        var list = document.getElementsByClassName("plot2");


        if (value == "Histogram") {
            this.props.upateCurrentWorkingTabAndObject("getHistplotBN");
            if (this.props.data.preplots.histplotBN=="") { 
                this.props.getHistplotBN(); 
            }
        }
        if (value == "MAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotsBN");
             if (this.props.data.preplots.list_mAplotBN=="") { 
                this.props.getMAplotsBN();
            }
        }
        if (value == "Boxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotBN");
             if (this.props.data.preplots.Boxplots=="") { 
                 this.props.getBoxplotBN();
            }
        }
        if (value == "RLE") { // 
            this.props.upateCurrentWorkingTabAndObject("getRLE");
             if (this.props.data.preplots.RLE=="") { 
                 this.props.getRLE();
            }

        }
        if (value == "NUSE") {
            this.props.upateCurrentWorkingTabAndObject("getNUSE")
          
             if (this.props.data.preplots.NUSE=="") { 
                this.props.getNUSE();
            }

        }

        for (var i = 0; i < list.length; i++) {
            list[i].classList.add("hide");
        }
        document.getElementById(value).className = document.getElementById(value).className.replace("hide", "");

    }

    // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

    render() {


        let tabs = [<div id="Histogram" key="tag1" className="plot2" > { this.props.data.preplots.histplotBN } </div>,
            <div id="MAplots" key="tag2"  className="plot2 hide"  > { this.props.data.preplots.list_mAplotBN } </div>,
            <div id="Boxplots" key="tag3"  className="plot2 hide"> {this.props.data.preplots.Boxplots}</div>,
            <div id="RLE" key="tag4"  className="plot2 hide"> {this.props.data.preplots.RLE} </div>,
            <div id="NUSE" key="tag5"  className="plot2 hide"> {this.props.data.preplots.NUSE} </div>
        ]



        let content = [<Select key="select-pre-plots" defaultValue="Histogram"
                        style = { { width: 240 } } onChange={ this.handleSelectionChange } >
                        <Option key="opt-tag1" value="Histogram" > Histogram </Option> 
                        <Option key="opt-tag2" value="MAplots" > MAplots </Option>
                        <Option key="opt-tag3" value="Boxplots" > Boxplots </Option> 
                        <Option key="opt-tag4" value="RLE" > RLE </Option> 
                        <Option key="opt-tag5" value="NUSE" > NUSE </Option> 
                        </Select>, tabs]



        return (<div > { content } </div>)
    }
}

export default PrePlotsBox;