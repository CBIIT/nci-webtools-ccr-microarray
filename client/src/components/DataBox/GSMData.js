import React, { Component } from 'react';
import { Table } from 'antd';

class GSMData extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

  render() {
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
		  dataIndex: 'group',
		  width:'20%'
		}];
		let count = 1;
		this.props.data.dataList.forEach(function(fl){
			fl.key = count++;
		});
		const data = this.props.data.dataList;

		const rowSelection = {
		  onChange: (selectedRowKeys, selectedRows) => {
		    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		  },
		  getCheckboxProps: record => ({
		    disabled: record.name === 'Disabled User',
		    name: record.name,
		  }),
		};
		
  	  	content = <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
  	}

	return content;
  }
}

export default GSMData;