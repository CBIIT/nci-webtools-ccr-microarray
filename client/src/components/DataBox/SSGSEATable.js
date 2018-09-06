import React, { Component } from 'react';
import { Table ,Select} from 'antd';

const Option = Select.Option;


class SSGSEATable extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}
	

	handleSelectionChange(value) {
	  var list = document.getElementsByClassName("ss_plot");
		  for (var i = 0; i < list.length; i++) {
				list[i].classList.add("hide");
			}
		  document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");
		}	


  render() {

  	let content ="";
  	if(this.props.data.ssGSEA.length > 0){
		const columns = [{
		  title: 'Name',
		  dataIndex: '_row',
		 sorter: (a, b) => ('' + a["_row"]).localeCompare(b.a["_row"]),
		},{
		  title: 'logFC',
		  dataIndex: 'logFC',
		  sorter: (a, b) => a["logFC"]-b["logFC"],
		},{
		  title: 'Avg.Enrichment.Score',
		  dataIndex: 'Avg.Enrichment.Score',
		  sorter: (a, b) => a["Avg.Enrichment.Score"]-b["Avg.Enrichment.Score"],
		},{
		  title: 't',
		  dataIndex: 't',
		  sorter: (a, b) => a["t"]-b["t"],
		},{
		  title: 'P.Value',
		  dataIndex: 'P.Value',
		  sorter: (a, b) => a['P.Value']-b['P.Value'],
		},{
		  title: 'adj.P.Val',
		  dataIndex: 'adj.P.Val',
		  sorter: (a, b) => a['adj.P.Val']-b['adj.P.Val'],
		},{
		  title: 'B',
		  dataIndex: 'B',
		  sorter: (a, b) => a['B']-b['B'],
		},];
		

		const data = this.props.data.ssGSEA;
		var link = "./images/"+this.props.data.projectID+"/geneHeatmap1.jpg"


  	  	let tabs =[ <div id="ss_tag1" className="ss_plot">
		  							<Table columns={columns} dataSource={data} />
		  						</div>,
		  						  <div id="ss_tag2" className="ss_plot hide" >
		  						 <img src= {link}  style={{width:"100%"}} alt="Pathway Heatmap"/>
		  						</div>
		  		  ]
	    content = [<Select defaultValue="ss_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
							      <Option value="ss_tag1">Single Sample GSEA</Option>
							      <Option value="ss_tag2">Pathway Heatmap</Option>
							    </Select>,tabs]

  	}else{
		content=<div>No data</div>				
  	}

	return content;
  }
}

export default SSGSEATable;