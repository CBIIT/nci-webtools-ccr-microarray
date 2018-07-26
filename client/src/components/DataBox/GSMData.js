import React, { Component } from 'react';
import { Table ,Select,Input} from 'antd';
const Search = Input.Search;




class GSMData extends Component {


 state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    term:"" 
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

 	compareByAlph=(a, b)=> { if (a > b) { return -1; } if (a < b) { return 1; } return 0; }
 	
 	 handleSearch = (val) => {
      	if(val==""){
      		// clear search 
      		this.setState({
				data:Object.assign({},this.props.data.dataList)
			})
      	}else{
			let data = Object.assign({},this.props.data.dataList);
			const result = data.filter(d => d["gsm"].indexOf(val)>0||d["title"].indexOf(val)>0||d["description"].indexOf(val)>0);
			this.setState({
				data:result
			})
      	}


 	 }

  render() {

  	const { loading, selectedRowKeys } = this.state;


  	let content = (<p>Select one of the analyze type on the left and click on Load to load GSM data</p>);
  	if(this.props.data.dataList.length > 0){
		const columns = [{
		  title: 'gsm',
		  dataIndex: 'gsm',
		  width:'15%',
		  sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
		}, {
		  title: 'title',
		  dataIndex: 'title',
		  width:'30%',
		  sorter: (a, b) => this.compareByAlph(a.title,b.title),
		}, {
		  title: 'description',
		  dataIndex: 'description',
		  width:'30%',
		  sorter: (a, b) => a.description.length - b.description.length,
		}, {
		  title: 'group',
		  dataIndex: 'groups',
		  width:'20%',
		  sorter: (a, b) => this.compareByAlph(a.groups,b.groups),
		}];
		let count = 1;
		this.props.data.dataList.forEach(function(fl){
			fl.key = count++;
		});


		const data = [...this.props.data.dataList];
		//this.state.data;

		const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };

	  

	    const searchFilter = (row) => {
	    	if(this.state.term ==""){
	    		return true;
	    	}

	    	if (row["gsm"].includes(this.state.term)) return true;
	    	if (row["title"].includes(this.state.term)) return true;
	    	if (row["description"].includes(this.state.term)) return true;

	    	return false;
	    }

		content=<div>
					<div><Search  placeholder="input search text" style={{ "position":"absolute","top":"48px","left":"180px",width: 200 , "min-height":"15px",height:"35px"}}  onSearch={value => this.setState({term: value})} /></div>
					<div><Table rowSelection={rowSelection} columns={columns} dataSource={data.filter(searchFilter,this)} /></div>
				</div>	
  	  	
  	}else{

 						
  	}

	return content;
  }
}

export default GSMData;