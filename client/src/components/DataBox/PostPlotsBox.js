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

        if (value == "Histogram") { // 
            this.props.upateCurrentWorkingTabAndObject("getHistplotAN");
            this.props.getHistplotAN();

        }
        if (value == "MAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getMAplotAN");
            this.props.getMAplotAN();

        }

        if (value == "Boxplots") { // 
            this.props.upateCurrentWorkingTabAndObject("getBoxplotAN");
            this.props.getBoxplotAN();

        }

        if (value == "PCA") { //
            this.props.upateCurrentWorkingTabAndObject("getPCA");
            this.props.getPCA();

        }
        if (value == "Heatmap") { // 
            this.props.upateCurrentWorkingTabAndObject("getHeatmapolt");
            this.props.getHeatmapolt();

        }
    }

    render() {

        let content = [<Select key="select_post_tag2" defaultValue="Histogram" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option key="opt_post_tag1" value="Histogram">Histogram</Option>
                                  <Option key="opt_post_tag2" value="MAplots">MAplots</Option>
                                  <Option key="opt_post_tag3" value="Boxplots">Boxplots</Option>
                                  <Option key="opt_post_tag4" value="PCA">PCA</Option>
                                  <Option key="opt_post_tag5" value="Heatmap">Heatmap</Option>
                                </Select>, this.props.data.postplot]    


        return (
            <div>
            {content}
          </div>
        )
    }
}

export default PostPlotsBox;