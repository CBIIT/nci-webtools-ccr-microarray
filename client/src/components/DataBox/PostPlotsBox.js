import React, { Component } from 'react';
import { message } from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';
import MAPlot from './MAPlot';



class PostPlotsBox extends Component {


    constructor(props) {
        super(props);
        this.state = { content: "No Data" };

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
    }

    componentDidMount() {
        if(this.props.data.dataList.length>0){
            this.handleSelectionChange(null)
        }
    }
    handleSelectionChange(event) {
        let value = event==null?"postHistogram":event.target.value;
        var list = document.getElementsByClassName("plot2");
        if (value == "postHistogram") { // 
            this.props.upateCurrentWorkingTabAndObject("getHistplotAN");
            if (this.props.data.postplot.histplotAN == "") {
                this.props.getHistplotAN();
            }


        }
        if (value == "postMAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotAN");
            if (this.props.data.postplot.list_mAplotAN == "") {
                this.props.getMAplotAN();
            }

        }

        if (value == "postBoxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotAN");
            if (this.props.data.postplot.Boxplots == "") {
                this.props.getBoxplotAN();
            }

        }

        if (value == "postPCA") { //
            this.props.upateCurrentWorkingTabAndObject("getPCA");
            if (this.props.data.postplot.PCA == "") {
                this.props.getPCA();
            }

        }
        if (value == "postHeatmap") { // 
            this.props.upateCurrentWorkingTabAndObject("getHeatmapolt");
            if (this.props.data.postplot.Heatmapolt == "") {
                this.props.getHeatmapolt();
            }

        }


        for (var i = 0; i < list.length; i++) {
            list[i].classList.add("hide");
        }
        document.getElementById(value).className = document.getElementById(value).className.replace("hide", "");
    }

    render() {


        let tabs = [
            <div id="postHistogram" key="post_tag1" className="plot2" > <div> <p className="err-message" id="message-post-histogram"></p></div>   { this.props.data.postplot.histplotAN } </div>,
            <div id="postMAplots" key="post_tag2"  className="plot2 hide"  > <div> <p className="err-message" id="message-post-maplot"></p></div><div > <MAPlot pics = {this.props.data.list_mAplotBN}  data = {this.props.data}/></div></div>,
            <div id="postBoxplots" key="post_tag3"  className="plot2 hide">  <div> <p className="err-message" id="message-post-boxplot"></p></div>{this.props.data.BoxplotAN.plot}</div>,
            <div id="postPCA" key="post_tag4"  className="plot2 hide">  <div> <p className="err-message" id="message-post-pca"></p></div>{this.props.data.PCA.plot} </div>,
            <div id="postHeatmap" key="post_tag5"  className="plot2 hide">  <div> <p className="err-message" id="message-post-heatmap"></p></div>{this.props.data.postplot.Heatmapolt} </div>
        ]




        let content = [<label key="label-post-normalization-plots-selection" htmlFor="post-normalization-plots-selection">Select Post-Normalization QC Plots</label>,<select  key="select-post-normalization-plots-selection" id="post-normalization-plots-selection" className="ant-select-selection ant-select-selection--single" key="select_post_tag2" defaultValue="postHistogram"  onChange={this.handleSelectionChange}>
                                  <option key="post_opt_post_tag1" value="postHistogram">Histogram</option>
                                  <option key="post_opt_post_tag2" value="postMAplots">MAplots</option>
                                  <option key="post_opt_post_tag3" value="postBoxplots">Boxplots</option>
                                  <option key="post_opt_post_tag4" value="postPCA">PCA</option>
                                  <option key="post_opt_post_tag5" value="postHeatmap">Heatmap</option>
                                </select>, tabs]


        return (
            <div>
            {content}
          </div>
        )
    }
}

export default PostPlotsBox;