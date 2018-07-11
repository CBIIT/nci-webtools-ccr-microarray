import React, { Component } from 'react';
import Workflow from '../Workflow/Workflow';
import DataBox from '../DataBox/DataBox';
import {Spin, message, Icon } from 'antd';

class Analysis extends Component {

	constructor(props){
		super(props);
		this.state = {
			workflow:{
				projectID:"",
				analysisType:"-1",
				accessionCode:"",
				fileList: [],
      			uploading: false,
      			progressing:false,
      			loading_info:"",
      			dataList:[],
      			groups:[],
      			group_1:"-1",
      			group_2:"-1",
      			pDEGs:0.05,
      			foldDEGs:1.5,
      			pPathways:0.05,
      			compared:false,
      			done_gsea:false

			}
		};
		this.changeProject = this.changeProject.bind(this);
		this.changeCode = this.changeCode.bind(this);
		this.handleSelectType = this.handleSelectType.bind(this);
	}

	changeProject(event){
		let workflow = Object.assign({},this.state.workflow);
		workflow.projectID = event.target.value;
		this.setState({workflow:workflow});
	}

	changePDEGs = (event) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.pDEGs = event.target.value;
		this.setState({workflow:workflow});
	}

	changeFoldDEGs = (event) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.foldDEGs = event.target.value;
		this.setState({workflow:workflow});
	}

	changePathways = (event) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.pPathways = event.target.value;
		this.setState({workflow:workflow});
	}

	changeCode(event){
		let workflow = Object.assign({},this.state.workflow);
		workflow.accessionCode = event.target.value;
		this.setState({workflow:workflow});
	}

	handleSelectType = (value) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.analysisType = value;
		this.setState({workflow:workflow});
	}

	handleGroup1Select = (value) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.group_1 = value;
		this.setState({workflow:workflow});
	}

	handleGroup2Select = (value) =>{
		let workflow = Object.assign({},this.state.workflow);
		workflow.group_2 = value;
		this.setState({workflow:workflow});
	}

	fileRemove = (file) =>{
		let workflow = Object.assign({},this.state.workflow);
		const index = workflow.fileList.indexOf(file);
        const newFileList = workflow.fileList.slice();
        newFileList.splice(index, 1);
        workflow.fileList = newFileList;
		this.setState({workflow:workflow});
	}

	beforeUpload = (fl) =>{
		let workflow = Object.assign({},this.state.workflow);
		let names = [];
		workflow.fileList.forEach(function(f){
			names.push(f.name);
		});
		fl.forEach(function(file){
			if(names.indexOf(file.name) == -1){
				workflow.fileList = [...workflow.fileList, file];
			}
		});
		this.setState({workflow:workflow});
	}

	loadGSE = () =>{
		let workflow = Object.assign({},this.state.workflow);
	    let reqBody = {};
	    reqBody.code = workflow.accessionCode;

	    // this pid will be used to create a tmp folder to store the data. 
	    // need to validate if it is a validate project
	    reqBody.pid=workflow.projectID=Date.now()+workflow.projectID;
	    workflow.uploading = true;
	    workflow.progressing = true;
	    workflow.loading_info = "Loading GEO Data...";
	    this.setState({
	      workflow:workflow
	    });
	    fetch('./api/analysis/gse',{
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: {
		        'Content-Type': 'application/json'
		    }
		})
			.then(res => res.json())
			.then(result => {
				let list = result.data;
				workflow.uploading = false;
				workflow.progressing = false;
				workflow.dataList = list.files;
				// init group with default value
				workflow.group = new Array(list.files.length).fill('Ctl');

				this.setState({
			      workflow:workflow
			    });
			    message.success('load successfully.');
			});
	}

	runContrast = () =>{
		let workflow = Object.assign({},this.state.workflow);
		let reqBody = {};
		reqBody.code = workflow.accessionCode;
		reqBody.projectID = workflow.projectID;
		reqBody.groups =[];
		for(var i in workflow.dataList){
			if(workflow.dataList[i].groups!=""){
				reqBody.groups.push(workflow.dataList[i].groups)
			}else{
				reqBody.groups.push("ctl")
			}
		}

		reqBody.pDEGs = workflow.pDEGs;
		reqBody.foldDEGs = workflow.foldDEGs;
		reqBody.pPathways = workflow.pPathways;

		workflow.progressing = true;
		workflow.loading_info = "Running Contrast... (this might take a few minutes)";
	    this.setState({
	      workflow:workflow
	    });
	    fetch('./api/analysis/runContrast',{
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: {
		        'Content-Type': 'application/json'
		    }
		})
			.then(
				res => res.json()
				)
			.then(result => {
				if(result.status==200){
					let list =JSON.parse(result.data).listData;
					workflow.progressing = false;
					workflow.HistplotBN = list[0];                  // svg file
					workflow.MAplotBN = list[1].listData;			// images list[jpg]
					workflow.BoxplotBN = list[2];					// svg file
					workflow.RLEplotBN = list[3];					// svg file
					workflow.NUSEplotBN = list[4];					// svg file
					workflow.HistplotAN = list[5];					// svg file
					workflow.MAplotAN = list[6].listData;			// images list[jpg]
					workflow.BoxplotAN = list[7];					// svg file
					workflow.PCA = list[8];							// html file
					workflow.Heatmapolt = list[9];					// html file
					// the response contains the response time. 
					console.log("running time:" + list[10])         // seconds   	
					workflow.compared=true;
					this.setState({
				      workflow:workflow
				    });
				    message.success('Plots loaded successfully.');
				}else{
					 message.success('Generate plots fails.');	
				}
				
			});
	}

	handleUpload = () => {
		let workflow = Object.assign({},this.state.workflow);
	    const fileList = workflow.fileList;
	    const formData = new FormData();
	    fileList.forEach((file) => {
	      formData.append('cels', file);
	    });
	    workflow.uploading = true;
	    workflow.progressing = true;
	    this.setState({
	      workflow:workflow
	    });
	    fetch('./api/analysis/upload',{
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(result => {
				let list = result.data;
				workflow.uploading = false;
				workflow.progressing = false;
				workflow.dataList = list.files ;
				// init group with default value
				workflow.group = new Array(list.files.length).fill('Ctl');

				this.setState({
			      workflow:workflow
			    });
			    message.success('load successfully.');
			});
	    
	  }

	assignGroup=(group_name,dataList_keys)=>{
		let workflow = Object.assign({},this.state.workflow);
		for(var key in dataList_keys){
			workflow.dataList[dataList_keys[key]-1].groups=group_name;
		}
		this.setState({
			      workflow:workflow
			    });
		message.success('Add group successfully.');
	}

	deleteGroup=(group_name)=>{

		let workflow = Object.assign({},this.state.workflow);
		for(var key in workflow.dataList){
			if(workflow.dataList[key].groups==group_name){
				workflow.dataList[key].groups=""
			}
		}
		this.setState({
			      workflow:workflow
			    });
		message.success('Delete  group successfully.');

	}
	render() {
		let modal = this.state.workflow.progressing?"progress":"progress-hidden";
		const antIcon = <Icon type="loading" style={{ fontSize: 48, width:48,height:48 }} spin />;
		return (
			<div className="content">
				<div className="container container-board">
			      <Workflow data={this.state.workflow} changeProject={this.changeProject} 
			      		changeCode={this.changeCode} handleSelectType={this.handleSelectType}  
			      		fileRemove={this.fileRemove} beforeUpload={this.beforeUpload} handleUpload={this.handleUpload} 
			      		loadGSE={this.loadGSE} handleGroup1Select={this.handleGroup1Select}  handleGroup2Select={this.handleGroup2Select} 
			      		changePDEGs={this.changePDEGs} changeFoldDEGs={this.changeFoldDEGs} changePathways={this.changePathways} runContrast={this.runContrast}/>
			      <DataBox  data={this.state.workflow} assignGroup={this.assignGroup} deleteGroup={this.deleteGroup}/>
			    </div>
			    <div className={modal}>
					<Spin indicator={antIcon} style={{color:"black"}} />
					<label className="loading-info">{this.state.workflow.loading_info}</label>
				</div>
			</div>
		);
	}
}

export default Analysis;