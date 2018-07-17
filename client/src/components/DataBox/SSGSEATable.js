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
		  title: '0',
		  dataIndex: 0,
		},{
		  title: '1',
		  dataIndex: 1,
		},{
		  title: '2',
		  dataIndex: 2,
		},{
		  title: '3',
		  dataIndex: 3,
		},{
		  title: '4',
		  dataIndex: 4,
		},{
		  title: '5',
		  dataIndex: 5,
		},{
		  title: '6',
		  dataIndex: 6,
		},{
		  title: '7',
		  dataIndex: 7,
		},{
		  title: '8',
		  dataIndex: 8,
		},{
		  title: '9',
		  dataIndex: 9,
		},{
		  title: '10',
		  dataIndex: 10,
		},{
		  title: '11',
		  dataIndex: 11,
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