import React, { Component } from 'react';
import { Table,Input,message,Modal,Button,Tooltip} from 'antd';
const Search = Input.Search;


class PUGTable extends Component {


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
			 reqBody.group1=this.props.data.group_1;
			 reqBody.group2=this.props.data.group_2;
			 reqBody.upOrDown="downregulated_pathways";
			 reqBody.pathway_name=row.Description;

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
  	var content_length =this.props.data.pathways_up.length;
  	if(this.props.data.pathways_up.length > 0){
		const columns = [{
		  title: 'Pathway_ID',
		  dataIndex: 'Pathway_ID',
		   width: "10%",
		   key:'Pathway_ID',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a["Pathway_ID"]-b["Pathway_ID"];
		  	}
		  }
		  	
		}, {
		  title: 'Source',
		  dataIndex: 'Source',
		   width: "8%",
		    key:'Source',
		  sorter:function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a.Source).localeCompare(b.Source);
		  	}
		  }
		}, {
		  title: 'Description',
		  dataIndex: 'Description',
		  width:"14%",
		   key:'Description',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a.Description).localeCompare(b.Description);
		  	}
		  },
		  render: (text, record, index) => (
                       <div className="single-line" style={{"maxWidth":"100px"}}>
                        <Tooltip title={text} placement="topLeft" >
                          <span>{text}</span>
                        </Tooltip>
                      </div>
            ),
		}, {
		  title: 'Type',
		  dataIndex: 'Type',
		  width:"7%",
		  key:'Type',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a.Type).localeCompare(b.Type);
		  	}
		  }
		}, {
		  title: 'P_Value',
		  dataIndex: 'P_Value',
		  width: "8%",
		  key:'P_Value',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a.P_Value-b.P_Value;
		  	}
		  }
		}, {
		  title: 'FDR',
		  dataIndex: 'FDR',
		   width: "8%",
		   key:'FDR',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a.FDR-b.FDR;
		  	}
		  }
		}, {
		  title: 'Ratio',
		  dataIndex: 'Ratio',
		   width: "8%",
		   key:'Ratio',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a.Ratio-b.Ratio;
		  	}
		  }
		}, {
		  title: 'Gene_List',
		  dataIndex: 'Gene_List',
		  width:"12%",
		  key:'Gene_List',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a["Gene_List"]).localeCompare(b["Gene_List"]);
		  	}
		  },
		    render: (text, record, index) => (
                     <div className="single-line" style={{"maxWidth":"100px"}}>
                        <Tooltip title={text} placement="topLeft" >
                          <span>{text}</span>
                        </Tooltip>
                      </div>
            ),
		}, {
		  title: 'Number_Hits',
		  dataIndex: 'Number_Hits',
		  width:"85px",
		  key:'Number_Hits',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a.Number_Hits-b.Number_Hits;
		  	}
		  }
		}, {
		  title: 'Number_Genes_Pathway',
		  dataIndex: 'Number_Genes_Pathway',
		   width:"95px",
		     key:'Number_Genes_Pathway',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a['Number_Genes_Pathway']-b['Number_Genes_Pathway'];
		  	}
		  }

		},{
		  title: 'Number_User_Genes',
		  dataIndex: 'Number_User_Genes',
		  width:"85px",
		   key:'Number_User_Genes',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a['Number_User_Genes']-b['Number_User_Genes'];
		  	}
		  }
		},{
		  title: 'Total_Number_Genes',
		  dataIndex: 'Total_Number_Genes',
		  width:"90px",
		    key:'Total_Number_Genes',
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a['Total_Number_Genes']-b['Total_Number_Genes'];
		  	}
		  }
		}];
		

		 const data = this.props.data.pathways_down;
		
			
  	  	  const searchFilter = (row) => {
	    	if(this.state.term ===""){
	    		return true;
	    	}

	    	if (row["Source"].includes(this.state.term)) return true;
	    	if (row["Description"].includes(this.state.term)) return true;
	    	if (row["Type"].includes(this.state.term)) return true;
	    	if (row["Pathway_ID"].includes(this.state.term)) return true;

	    	return false;
	    }

			

  	  	 // define group modal
	    let modal = <Modal key="modal_pathway_gene_heatmap" visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
	        footer={[
	            <Button key="back" onClick={this.handleCancel}>Close</Button>,
	          ]}
	        >
	          <img src={this.state.heapMap} style={{width:"100%"}} alt="heapMap"/>
	        </Modal>
	    // end  group modal

		content=<div>
					<div><Search  placeholder="input search text" className="input-search-for-deg-path" onSearch={value => this.setState({term: value})} /></div>
					<div><Table 
							rowKey='Pathway_ID'
							columns={columns} 
							dataSource={data.filter(searchFilter,this) }   
							onRowClick={(row, idx, event)=>this.showHeapMap(row, idx, event)}  
					      /> 
					      {modal}
      	</div>
				</div>	

  	}else{
		content=<div>No data</div>				
  	}

	return content;
  }
}

export default PUGTable;