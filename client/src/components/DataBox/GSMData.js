import React, { Component } from 'react';
import { Table ,Select} from 'antd';





class GSMData extends Component {


 state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

	onSelectChange=(selectedRowKeys)=>{
		this.props.selected(selectedRowKeys);	
		this.setState({ selectedRowKeys });
		}


    unselect = () => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
 	 }


 	

  render() {

  	const { loading, selectedRowKeys } = this.state;

  	let content = (<p>Select one of the analyze type on the left and click on Load to load GSM data</p>);
  	if(this.props.data.dataList.length > 0){
		const columns = [{
		  title: 'gsm',
		  dataIndex: 'gsm',
		  width:'15%'
		}, {
		  title: 'title',
		  dataIndex: 'title',
		  width:'30%'
		}, {
		  title: 'description',
		  dataIndex: 'description',
		  width:'30%'
		}, {
		  title: 'group',
		  dataIndex: 'groups',
		  width:'20%'
		}];
		let count = 1;
		this.props.data.dataList.forEach(function(fl){
			fl.key = count++;
		});

		const data = this.props.data.dataList;

		const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };
			
  	  	content = <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
  	}else{

  		// for testing   

  		//content = <div><iframe src={"http://localhost:9000/images/1531248646100s/heatmapAfterNorm.html"}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


						
  	}

	return content;
  }
}

export default GSMData;