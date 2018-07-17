import React, { Component } from 'react';
import { Table ,Select} from 'antd';





class DEGTable extends Component {



	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

	
  render() {


  	let content = "";
  	if(this.props.data.length > 0){
		const columns = [{
		  title: 'SYMBOL',
		  dataIndex: 'SYMBOL',
		}, {
		  title: 'FC',
		  dataIndex: 'FC',
		}, {
		  title: 'P.value',
		  dataIndex: 'P.Value',
		}, {
		  title: 'adj.P.Val',
		  dataIndex: 'adj.P.Val',
		}, {
		  title: 'AveExpr',
		  dataIndex: 'AveExpr',
		}, {
		  title: 'ACCNUM',
		  dataIndex: 'ACCNUM',
		}, {
		  title: 'DESC',
		  dataIndex: 'DESC',
		}, {
		  title: 'ENTREZ',
		  dataIndex: 'ENTREZ',
		}, {
		  title: 'probsetID',
		  dataIndex: 'probsetID',
		}, {
		  title: 't',
		  dataIndex: 't',
		},{
		  title: 'b',
		  dataIndex: 'b',
		}];
	 const data = this.props.data;
			
  	  	content = <Table columns={columns} dataSource={data} />;
  	}else{

  		// for testing   

  		//content = <div><iframe src={"http://localhost:9000/images/1531248646100s/heatmapAfterNorm.html"}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


						
  	}

	return content;
  }
}

export default DEGTable;