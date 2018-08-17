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
		  title: 'path_id',
		  dataIndex: 'path_id',
		   sorter: (a, b) => ('' + a["path_id"]).localeCompare(b["path_id"]),
		}, {
		  title: 'source',
		  dataIndex: 'source',
		  sorter: (a, b) => ('' + a["source"]).localeCompare(b["source"]),
		}, {
		  title: 'description',
		  dataIndex: 'description',
		  sorter: (a, b) => ('' + a["description"]).localeCompare(b["description"]),
		}, {
		  title: 'type',
		  dataIndex: 'type',
		   sorter: (a, b) => ('' + a["type"]).localeCompare(b["type"]),
		}, {
		  title: 'pval',
		  dataIndex: 'pval',
		  sorter: (a, b) => a.pval-b.pval,
		}, {
		  title: 'fdr',
		  dataIndex: 'fdr',
		  sorter: (a, b) => a.fdr-b.fdr,
		}, {
		  title: 'ratio',
		  dataIndex: 'ratio',
		  sorter: (a, b) => a.ratio-b.ratio,
		}, {
		  title: 'gene.list',
		  dataIndex: 'gene.list',
		  sorter: (a, b) => ('' + a["gene.list"]).localeCompare(b["gene.list"]),
		}, {
		  title: 'nb.hits',
		  dataIndex: 'nb.hits',
		  sorter: (a, b) => a["nb.hits"]-b["nb.hits"],
		}, {
		  title: 'nb.genes.path',
		  dataIndex: 'nb.genes.path',
		  sorter: (a, b) => a["nb.genes.path"]-b["nb.genes.path"],
		},{
		  title: 'nb.user.genes',
		  dataIndex: 'nb.user.genes',
		  sorter: (a, b) => a["nb.user.genes"]-b["nb.user.genes"],
		},{
		  title: 'tot.back.genes',
		  dataIndex: 'tot.back.genes',
		  sorter: (a, b) => a["tot.back.genes"]-b["tot.back.genes"],
		},{
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