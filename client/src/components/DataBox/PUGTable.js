import React, { Component } from 'react';
import { Table,Input,message,Modal,Button} from 'antd';
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
const Search = Input.Search;




class PUGTable extends Component {
	// term: search keywords


	constructor(props){
		super(props);

	    this.state = {
    	term:"" ,
    	heapMap:"",
    	visible: false,
    	stepsEnabled: true,
        initialStep: 0,
        steps: [
        {
          element: '.patyway_up_1',
          intro: 'Click Row to show gene heapMap',
        },
      ]
	 	}
	}
 onExit = () => {
    this.setState(() => ({ stepsEnabled: false }));
  };

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
			 reqBody.upOrDown="upregulated_pathways";
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
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a.Description).localeCompare(b.Description);
		  	}
		  }
		}, {
		  title: 'Type',
		  dataIndex: 'Type',
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
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return ('' + a["Gene_List"]).localeCompare(b["Gene_List"]);
		  	}
		  }
		}, {
		  title: 'Number_Hits',
		  dataIndex: 'Number_Hits',
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
		  sorter: function(a, b) {
		  	if(content_length>15000){
		  		console.log(content_length);
		  		// to be finished
		  	}else{
		  		return a['Total_Number_Genes']-b['Total_Number_Genes'];
		  	}
		  }
		}];
		

		 const data = this.props.data.pathways_up;
			
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
	    let modal = <Modal visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
	        footer={[
	            <Button key="back" onClick={this.handleCancel}>Close</Button>,
	          ]}
	        >
	          <img src={this.state.heapMap} style={{width:"75%"}} alt="heapMap"/>
	        </Modal>
	    // end  group modal

		content=<div> <Steps
			          enabled={this.state.stepsEnabled}
			          steps={this.state.steps}
			          initialStep={this.state.initialStep}
			          onExit={this.onExit}
			        />
					<div><Search  placeholder="input search text" className="input-search-for-deg-path" onSearch={value => this.setState({term: value})} /></div>
					<div><Table 
							columns={columns} 
							dataSource={data.filter(searchFilter,this) }   
							onRowClick={(row, idx, event)=>this.showHeapMap(row, idx, event)}  
							rowClassName={(record, index)=>"patyway_up_"+index}
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