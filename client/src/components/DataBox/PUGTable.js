import React, { Component } from 'react';
import { Table ,Select,Input} from 'antd';
const Search = Input.Search;




class PUGTable extends Component {



	state = {
    	term:"" 
	 };

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
		  sorter: (a, b) => a["path_id"]-b["path_id"],
		}, {
		  title: 'source',
		  dataIndex: 'source',
		  sorter: (a, b) => ('' + a.source).localeCompare(b.source),
		}, {
		  title: 'description',
		  dataIndex: 'description',
		  sorter: (a, b) => ('' + a.description).localeCompare(b.description),
		}, {
		  title: 'type',
		  dataIndex: 'type',
		  sorter: (a, b) => ('' + a.type).localeCompare(b.type),
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
		  sorter: (a, b) => a.hits-b.hits,
		}, {
		  title: 'nb.genes.path',
		  dataIndex: 'nb.genes.path',
		  sorter: (a, b) => a['nb.genes.path']-b['nb.genes.path'],

		},{
		  title: 'nb.user.genes',
		  dataIndex: 'nb.user.genes',
		  sorter: (a, b) => a['nb.user.genes']-b['nb.user.genes'],
		},{
		  title: 'tot.back.genes',
		  dataIndex: 'tot.back.genes',
		  sorter: (a, b) => a['tot.back.genes']-b['tot.back.genes'],
		}];
		

		 const data = this.props.data;
			
  	  	  const searchFilter = (row) => {
	    	if(this.state.term ==""){
	    		return true;
	    	}

	    	if (row["source"].includes(this.state.term)) return true;
	    	if (row["description"].includes(this.state.term)) return true;
	    	if (row["type"].includes(this.state.term)) return true;

	    	return false;
	    }

		content=<div>
					<div><Search  placeholder="input search text" style={{ width: 200 , "min-height":"15px",height:"35px"}}  onSearch={value => this.setState({term: value})} /></div>
					<div><Table  columns={columns} dataSource={data.filter(searchFilter,this)} /></div>
				</div>	
  	  	
  	}else{

  		// for testing   

  		//content = <div><iframe src={"http://localhost:9000/images/1531248646100s/heatmapAfterNorm.html"}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


						
  	}

	return content;
  }
}

export default PUGTable;