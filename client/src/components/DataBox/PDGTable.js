import React, { Component } from 'react';
import { Table ,Select} from 'antd';

class PUGTable extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}



	
  render() {
  	
  	let content ="";
  	if(this.props.data.pathways_down.length > 0){
		const columns = [{
		  title: 'Pathway_ID',
		  dataIndex: 'Pathway_ID',
		  sorter: (a, b) => a["Pathway_ID"]-b["Pathway_ID"],
		}, {
		  title: 'Source',
		  dataIndex: 'Source',
		  sorter: (a, b) => ('' + a.source).localeCompare(b.source),
		}, {
		  title: 'Description',
		  dataIndex: 'Description',
		  sorter: (a, b) => ('' + a.description).localeCompare(b.description),
		}, {
		  title: 'Type',
		  dataIndex: 'Type',
		  sorter: (a, b) => ('' + a.type).localeCompare(b.type),
		}, {
		  title: 'P_Val',
		  dataIndex: 'P_Val',
		  sorter: (a, b) => a.pval-b.pval,
		}, {
		  title: 'FDR',
		  dataIndex: 'FDR',
		  sorter: (a, b) => a.fdr-b.fdr,
		}, {
		  title: 'Ratio',
		  dataIndex: 'Ratio',
		  sorter: (a, b) => a.ratio-b.ratio,
		}, {
		  title: 'Gene_List',
		  dataIndex: 'Gene_List',
		  sorter: (a, b) => ('' + a["gene.list"]).localeCompare(b["gene.list"]),
		}, {
		  title: 'Number_Hits',
		  dataIndex: 'Number_Hits',
		  sorter: (a, b) => a.hits-b.hits,
		}, {
		  title: 'Number_Genes_Pathway',
		  dataIndex: 'Number_Genes_Pathway',
		  sorter: (a, b) => a['nb.genes.path']-b['nb.genes.path'],

		},{
		  title: 'Number_User_Genes',
		  dataIndex: 'Number_User_Genes',
		  sorter: (a, b) => a['nb.user.genes']-b['nb.user.genes'],
		},{
		  title: 'Total_Number_Genes',
		  dataIndex: 'Total_Number_Genes',
		  sorter: (a, b) => a['tot.back.genes']-b['tot.back.genes'],
		}];

		const data = this.props.data.pathways_down;
			
  	  	content = <Table columns={columns} dataSource={data} />;
  	}else{
		content=<div>No data</div>				
  	}

	return content;
  }
}

export default PUGTable;