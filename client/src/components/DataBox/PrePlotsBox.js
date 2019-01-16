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
        if(this.props.data.dataList.length>0){
             this.handleSelectionChange("preHistogram")
        }
    }

    handleSelectionChange(value) {

        var list = document.getElementsByClassName("plot1");


        if (value == "preHistogram") {
            this.props.upateCurrentWorkingTabAndObject("getHistplotBN");
            if (this.props.data.preplots.histplotBN=="") { 
                this.props.getHistplotBN(); 
            }
        }
        if (value == "preMAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotsBN");
             if (this.props.data.preplots.list_mAplotBN=="") { 
                this.props.getMAplotsBN();
            }
        }
        if (value == "preBoxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotBN");
             if (this.props.data.preplots.Boxplots=="") { 
                 this.props.getBoxplotBN();
            }
        }
        if (value == "preRLE") { // 
            this.props.upateCurrentWorkingTabAndObject("getRLE");
             if (this.props.data.preplots.RLE=="") { 
                 this.props.getRLE();
            }

        }
        if (value == "preNUSE") {
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


        let tabs = [<div id="preHistogram" key="pre_tag1" className="plot1" ><div> <p className="err-message" id="message-pre-histogram"></p></div>   { this.props.data.preplots.histplotBN } </div>,
            <div id="preMAplots" key="pre_tag2"  className="plot1 hide"  > <div> <p className="err-message" id="message-pre-maplot"></p></div>  { this.props.data.preplots.list_mAplotBN } </div>,
            <div id="preBoxplots" key="pre_tag3"  className="plot1 hide"> <div> <p className="err-message" id="message-pre-boxplot"></p></div>  {this.props.data.preplots.Boxplots}</div>,
            <div id="preRLE" key="pre_tag4"  className="plot1 hide"> <div> <p className="err-message" id="message-pre-rle"></p></div>  {this.props.data.preplots.RLE} </div>,
            <div id="preNUSE" key="pre_tag5"  className="plot1 hide"> <div> <p className="err-message" id="message-pre-nuse"></p></div>  {this.props.data.preplots.NUSE} </div>
        ]



        let content = [<Select key="select-pre-plots" defaultValue="preHistogram"
                        style = { { width: 240 } } onChange={ this.handleSelectionChange } >
                        <Option key="pre_opt-tag1" value="preHistogram" > Histogram </Option> 
                        <Option key="pre_opt-tag2" value="preMAplots" > MAplots </Option>
                        <Option key="pre_opt-tag3" value="preBoxplots" > Boxplots </Option> 
                        <Option key="pre_opt-tag4" value="preRLE" > RLE </Option> 
                        <Option key="pre_opt-tag5" value="preNUSE" > NUSE </Option> 
                        </Select>, tabs]



        return (<div > { content } </div>)
    }
}

export default PrePlotsBox;