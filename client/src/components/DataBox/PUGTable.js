import React, { Component } from 'react';
import { Table,Input,message,Modal,Button} from 'antd';
const Search = Input.Search;




class PUGTable extends Component {
	// term: search keywords


	constructor(props){
		super(props);

	    this.state = {
    	term:"" ,
    	heapMap:"",
    	visible: false
	 	}
	}


 handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  handleCancel = () => {
    this.setState({ group:"",selected:[],visible: false });
  }


	showHeapMap(row, idx, event){
		 // not reflected in interface 
		 let reqBody = {};
			 reqBody.projectId=this.props.data.projectID;
			 reqBody.group1=this.props.data.group1;
			 reqBody.group2=this.props.data.group2;
			 reqBody.upOrDown="upregulated_pathways";

		fetch('./api/analysis/pathwaysHeapMap',{
			method: "POST",
			body: JSON.stringify(reqBody),
			credentials: "same-origin",
			headers: {
		        'Content-Type': 'application/json'
		    }
		}).then(
				res => res.json()
				)
			.then(result => {

				if(result.status==200){
					if(Object.keys(result.data).length === 0 && result.data.constructor === Object){

						 message.success('no rows to aggregate');
						 	
					}else{

						var link = "./images/"+this.props.data.projectID+"/"+result.data
						this.setState({
					      heapMap:link,
					      visible: true
					    });
					}
					

				}else{
					 message.success('no rows to aggregate');	
				}

			})


	}

  render() {

  	const {visible} = this.state;
  	let content ="";
  	if(this.props.data.pathways_up.length > 0){
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
		

		 const data = this.props.data.pathways_up;
			
  	  	  const searchFilter = (row) => {
	    	if(this.state.term ===""){
	    		return true;
	    	}

	    	if (row["source"].includes(this.state.term)) return true;
	    	if (row["description"].includes(this.state.term)) return true;
	    	if (row["type"].includes(this.state.term)) return true;

	    	return false;
	    }

	     // define group modal
	    let modal = <Modal visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
	        footer={[
	            <Button key="back" onClick={this.handleCancel}>Close</Button>,
	          ]}
	        >
	          <img src={this.state.heapMap} style={{width:"75%"}} alt="heapMap"/>
	        </Modal>
	    // end  group modal

		content=<div>
					<div><Search  placeholder="input search text" className="input-search-for-deg-path" onSearch={value => this.setState({term: value})} /></div>
					<div><Table 
							columns={columns} 
							dataSource={data.filter(searchFilter,this) }   
							onRowClick={(row, idx, event)=>this.showHeapMap(row, idx, event)}  
					      /> 
					      {modal}
      	</div>
				</div>	
  	  	
  	}else{

  		// for testing   

  		//content = <div><iframe src={"http://localhost:9000/images/1531248646100s/heatmapAfterNorm.html"}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>


						
  	}

	return content;
  }
}

export default PUGTable;