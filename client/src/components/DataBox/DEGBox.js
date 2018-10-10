import React, { Component } from 'react';
import DEGTable from './DEGTable'
import PUGTable from './PUGTable'
import PDGTable from './PDGTable'
import { Select } from 'antd';

const Option = Select.Option;


class DEGBox extends Component {


    constructor(props) {
        super(props);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.state = { content: "No Data" };
    }
     componentDidMount(){
        this.props.upateCurrentWorkingTabAndObject("deg")
        this.handleSelectionChange("deg_tag1")
    }


    handleSelectionChange(value) {
        if(value=="deg_tag1"){
         this.props.upateCurrentWorkingTabAndObject("deg")
         this.setState({ content: <div><DEGTable changeDeg={this.props.changeDeg} data={this.props.data} /></div>});
        }
        if(value=="deg_tag2"){
         this.props.upateCurrentWorkingTabAndObject("pathways_up")
           this.setState({ content:  <div><PUGTable changePathways_up={this.props.changePathways_up} data={this.props.data}/></div>});
        }
        if(value=="deg_tag3"){
         this.props.upateCurrentWorkingTabAndObject("pathways_down")
         this.setState({ content:  <div><PDGTable changePathways_down={this.props.changePathways_down} data={this.props.data}/></div>});

        }
        if(value=="deg_tag4"){
         this.props.upateCurrentWorkingTabAndObject("volcanoPlot")
          let volcanoPlotIframe = <div><iframe title="volcanoPlot" src={"./images/"+this.props.data.projectID+this.props.data.volcanoPlot}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>
         this.setState({ content:  {volcanoPlotIframe}});
        }

    }

    render() {

           let content = [<Select defaultValue="deg_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="deg_tag1">Differentially Expressed Genes</Option>
							      <Option value="deg_tag2">Pathways for Upregulated Genes</Option>
							      <Option value="deg_tag3">Pathways for Downregulated Genes</Option>
							      <Option value="deg_tag4">Interactive Volcano Plot</Option>
							    </Select>, this.state.content]

        return (
            <div>
		    {content}
		  </div>
        )
    }
}

export default DEGBox;