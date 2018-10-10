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
    }

    handleSelectionChange(value) {
        var list = document.getElementsByClassName("deg_plot");
          for (var i = 0; i < list.length; i++) {
                list[i].classList.add("hide");
            }
          document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");

        if(value=="deg_tag1"){
         this.props.upateCurrentWorkingTabAndObject("deg")
        }
        if(value=="deg_tag2"){
         this.props.upateCurrentWorkingTabAndObject("pathways_up")
        }
        if(value=="deg_tag3"){
         this.props.upateCurrentWorkingTabAndObject("pathways_down")
        }
        if(value=="deg_tag4"){
         this.props.upateCurrentWorkingTabAndObject("volcanoPlot")
        }

    }

    render() {
         let volcanoPlotIframe = <iframe title="volcanoPlot" src={"./images/"+this.props.data.projectID+this.props.data.volcanoPlot}  width={'100%'} height={'100%'} frameBorder={'0'}/>
      

        let tabs =[ <div key="deg_tag1" id="deg_tag1" className="deg_plot">
                                    <DEGTable changeDeg={this.props.changeDeg} data={this.props.data} />
                                </div>,
                                  <div key="deg_tag2_pathway_up" id="deg_tag2" className="deg_plot hide" ><PUGTable changePathways_up={this.props.changePathways_up} data={this.props.data}/></div>,
                                  <div key="deg_tag3_pathway_down" id="deg_tag3" className="deg_plot hide"><PDGTable changePathways_down={this.props.changePathways_down} data={this.props.data}/></div>,
                                  <div key="deg_tag4_volcano" id="deg_tag4" className="deg_plot hide">{volcanoPlotIframe}</div>]


           let content = [<Select defaultValue="deg_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="deg_tag1">Differentially Expressed Genes</Option>
							      <Option value="deg_tag2">Pathways for Upregulated Genes</Option>
							      <Option value="deg_tag3">Pathways for Downregulated Genes</Option>
							      <Option value="deg_tag4">Interactive Volcano Plot</Option>
							    </Select>, tabs]

        return (
            <div>
		    {content}
		  </div>
        )
    }
}

export default DEGBox;