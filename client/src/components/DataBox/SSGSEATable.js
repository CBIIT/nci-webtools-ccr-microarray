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

  		// for testing   

  		//content = <div><iframe src={"http://localhost:9000/images/1531248646100s/heatmapAfterNorm.html"}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


						
  	}

	return content;
  }
}

export default SSGSEATable;