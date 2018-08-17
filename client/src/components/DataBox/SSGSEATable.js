import React, { Component } from 'react';
import { Table ,Select} from 'antd';


class SSGSEATable extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
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
			
  	  	content = <Table columns={columns} dataSource={data} />;
  	}else{
		content=<div>No data</div>				
  	}

	return content;
  }
}

export default SSGSEATable;