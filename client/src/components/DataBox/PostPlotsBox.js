import React, { Component } from 'react';
import { Select, message } from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';

const Option = Select.Option;


class PostPlotsBox extends Component {


    constructor(props) {
        super(props);
        this.state = { content: "No Data" };

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
    }

    componentDidMount() {
        if(this.props.data.dataList.length>0){
            this.handleSelectionChange("postHistogram")
        }
    }
    handleSelectionChange(value) {
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
            <div id="postMAplots" key="post_tag2"  className="plot2 hide"  > <div> <p className="err-message" id="message-post-maplot"></p></div> { this.props.data.postplot.list_mAplotAN } </div>,
            <div id="postBoxplots" key="post_tag3"  className="plot2 hide">  <div> <p className="err-message" id="message-post-boxplot"></p></div>{this.props.data.postplot.Boxplots}</div>,
            <div id="postPCA" key="post_tag4"  className="plot2 hide">  <div> <p className="err-message" id="message-post-pca"></p></div>{this.props.data.postplot.PCA} </div>,
            <div id="postHeatmap" key="post_tag5"  className="plot2 hide">  <div> <p className="err-message" id="message-post-heatmap"></p></div>{this.props.data.postplot.Heatmapolt} </div>
        ]




        let content = [<Select key="select_post_tag2" defaultValue="postHistogram" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option key="post_opt_post_tag1" value="postHistogram">Histogram</Option>
                                  <Option key="post_opt_post_tag2" value="postMAplots">MAplots</Option>
                                  <Option key="post_opt_post_tag3" value="postBoxplots">Boxplots</Option>
                                  <Option key="post_opt_post_tag4" value="postPCA">PCA</Option>
                                  <Option key="post_opt_post_tag5" value="postHeatmap">Heatmap</Option>
                                </Select>, tabs]


        return (
            <div>
            {content}
          </div>
        )
    }
}

export default PostPlotsBox;