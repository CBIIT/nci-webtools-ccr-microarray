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
        this.handleSelectionChange("Histogram")
    }
    handleSelectionChange(value) {
        var list = document.getElementsByClassName("plot2");
        if (value == "post-Histogram") { // 
            this.props.upateCurrentWorkingTabAndObject("getHistplotAN");
            if (this.props.data.postplot.histplotAN == "") {
                this.props.getHistplotAN();
            }


        }
        if (value == "post-MAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotAN");
            if (this.props.data.postplot.list_mAplotAN == "") {
                this.props.getMAplotAN();
            }

        }

        if (value == "post-Boxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotAN");
            if (this.props.data.postplot.Boxplots == "") {
                this.props.getBoxplotAN();
            }

        }

        if (value == "post-PCA") { //
            this.props.upateCurrentWorkingTabAndObject("getPCA");
            if (this.props.data.postplot.PCA == "") {
                this.props.getPCA();
            }

        }
        if (value == "post-Heatmap") { // 
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
            <div id="post-Histogram" key="tag1" className="plot2" > { this.props.data.postplot.histplotAN } </div>,
            <div id="post-MAplots" key="tag2"  className="plot2 hide"  > { this.props.data.postplot.list_mAplotAN } </div>,
            <div id="post-Boxplots" key="tag3"  className="plot2 hide"> {this.props.data.postplot.Boxplots}</div>,
            <div id="post-PCA" key="tag4"  className="plot2 hide"> {this.props.data.postplot.PCA} </div>,
            <div id="post-Heatmap" key="tag5"  className="plot2 hide"> {this.props.data.postplot.Heatmapolt} </div>
        ]




        let content = [<Select key="select_post_tag2" defaultValue="post-Histogram" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option key="opt_post_tag1" value="post-Histogram">Histogram</Option>
                                  <Option key="opt_post_tag2" value="post-MAplots">MAplots</Option>
                                  <Option key="opt_post_tag3" value="post-Boxplots">Boxplots</Option>
                                  <Option key="opt_post_tag4" value="post-PCA">PCA</Option>
                                  <Option key="opt_post_tag5" value="post-Heatmap">Heatmap</Option>
                                </Select>, tabs]


        return (
            <div>
            {content}
          </div>
        )
    }
}

export default PostPlotsBox;