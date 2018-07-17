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
  	if(this.props.data.length > 0){
		const columns = [{
		  title: 'path_id',
		  dataIndex: 'path_id',
		}, {
		  title: 'source',
		  dataIndex: 'source',
		}, {
		  title: 'description',
		  dataIndex: 'description',
		}, {
		  title: 'type',
		  dataIndex: 'type',
		}, {
		  title: 'pval',
		  dataIndex: 'pval',
		}, {
		  title: 'fdr',
		  dataIndex: 'fdr',
		}, {
		  title: 'ratio',
		  dataIndex: 'ratio',
		}, {
		  title: 'gene.list',
		  dataIndex: 'gene.list',
		}, {
		  title: 'nb.hits',
		  dataIndex: 'nb.hits',
		}, {
		  title: 'nb.genes.path',
		  dataIndex: 'nb.genes.path',
		},{
		  title: 'nb.user.genes',
		  dataIndex: 'nb.user.genes',
		},{
		  title: 'tot.back.genes',
		  dataIndex: 'tot.back.genes',
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

export default PUGTable;