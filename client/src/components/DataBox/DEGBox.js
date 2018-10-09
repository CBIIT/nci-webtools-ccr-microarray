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
    }
     componentDidMount(){
        this.props.upateCurrentWorkingTabAndObject("deg")
    }

    handleSelectChange = (key) => {
        console.log(key);
    }

    handleSelectionChange(value) {
        if(value=="deg_tag1"){
         this.props.upateCurrentWorkingTabAndObject("deg")
        }
        if(value=="deg_tag2"){
         this.props.upateCurrentWorkingTabAndObject("UpPathWays")
        }
        if(value=="deg_tag3"){
         this.props.upateCurrentWorkingTabAndObject("DownPathWays")
        }
        if(value=="deg_tag4"){
         this.props.upateCurrentWorkingTabAndObject("volcanoPlot")
        }

        var list = document.getElementsByClassName("deg_plot");
        for (var i = 0; i < list.length; i++) {
            list[i].classList.add("hide");
        }
        document.getElementById(value).className = document.getElementById(value).className.replace("hide", "");
    }

    // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

    render() {

        let content = ""

        if (typeof(this.props.data.diff_expr_genes) !== "undefined") {


            var volcanoPlotIframe = <div><iframe title="volcanoPlot" src={"./images/"+this.props.data.projectID+this.props.data.volcanoPlot}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>

            let tabs = [<div id="deg_tag1" className="deg_plot">
		  							<DEGTable data={this.props.data.diff_expr_genes} />
		  						</div>,
                <div id="deg_tag2" className="deg_plot hide" ><PUGTable data={this.props.data}/></div>,
                <div id="deg_tag3" className="deg_plot hide"><PDGTable data={this.props.data}/></div>,
                <div id="deg_tag4" className="deg_plot hide">{volcanoPlotIframe}</div>
            ]

            content = [<Select defaultValue="deg_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="deg_tag1">Differentially Expressed Genes</Option>
							      <Option value="deg_tag2">Pathways for Upregulated Genes</Option>
							      <Option value="deg_tag3">Pathways for Downregulated Genes</Option>
							      <Option value="deg_tag4">Interactive Volcano Plot</Option>
							    </Select>, tabs]

        } else {
            content = " No data"
        }



        return (
            <div>
		    {content}
		  </div>
        )
    }
}

export default DEGBox;