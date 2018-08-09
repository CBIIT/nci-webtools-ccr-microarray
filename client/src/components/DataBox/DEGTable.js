import React, { Component } from 'react';
import { Table,Input} from 'antd';
const Search = Input.Search;


class DEGTable extends Component {

	state = {
    	term:"" 
	 };

	constructor(props){
		super(props);
	}

  render() {
  	let content = "";
  	if(this.props.data.length > 0){
		const columns = [{
		  title: 'SYMBOL',
		  dataIndex: 'SYMBOL',
		  sorter: (a, b) => ('' + a.SYMBOL).localeCompare(b.SYMBOL),
		}, {
		  title: 'FC',
		  dataIndex: 'FC',
		  sorter: (a, b) => a.FC-b.FC,
		}, {
		  title: 'P.value',
		  dataIndex: 'P.Value',
		  sorter: (a, b) => a["P.Value"]-b["P.Value"],
		}, {
		  title: 'adj.P.Val',
		  dataIndex: 'adj.P.Val',
		   sorter: (a, b) => a["adj.P.Val"]-b["adj.P.Val"],
		}, {
		  title: 'AveExpr',
		  dataIndex: 'AveExpr',
		  sorter: (a, b) => a["AveExpr"]-b["AveExpr"],
		}, {
		  title: 'ACCNUM',
		  dataIndex: 'ACCNUM',
		  sorter: (a, b) =>('' + a.ACCNUM).localeCompare(b.ACCNUM),
		}, {
		  title: 'DESC',
		  dataIndex: 'DESC',
		  width:'150px',
		   sorter: (a, b) => a.DESC.length - b.DESC.length,
		}, {
		  title: 'ENTREZ',
		  dataIndex: 'ENTREZ',
		  sorter: (a, b) => a["ENTREZ"]-b["ENTREZ"],
		  onCellClick:function(record, event){
		  	//https://www.ncbi.nlm.nih.gov/gene/171281
		  	if(record.ENTREZ!==""&&record.ENTREZ!=="NA"){
		  		window.open("https://www.ncbi.nlm.nih.gov/gene/"+record.ENTREZ);
		  	}
		  	
		  }
		}, {
		  title: 'probsetID',
		  dataIndex: 'probsetID',
		  sorter: (a, b) => ('' + a.probsetID).localeCompare(b.probsetID),
		}, {
		  title: 't',
		  dataIndex: 't',
		  sorter: (a, b) => a["t"]-b["t"],
		},{
		  title: 'B',
		  dataIndex: 'B',
		  sorter: (a, b) => a["B"]-b["B"],
		}];


		const data = this.props.data;

	    const searchFilter = (row) => {
	    	if(this.state.term ===""){
	    		return true;
	    	}

	    	if (row["DESC"].includes(this.state.term)) return true;

	    	return false;
	    }

		content=<div>
					<div><Search  placeholder="input search text"  className="input-search-for-deg-path"  onSearch={value => this.setState({term: value})} /></div>
					<div><Table  columns={columns} dataSource={data.filter(searchFilter,this)} /></div>
				</div>	


  	}else{

  		content=<div>No data</div>
						
  	}

	return content;
  }
}

export default DEGTable;