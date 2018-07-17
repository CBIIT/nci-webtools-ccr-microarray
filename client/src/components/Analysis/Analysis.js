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

	//use for generate UUID
	uuidv4() {  
	  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
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

	resetWorkFlowProject=()=>{
		window.location.reload(true);
	}

	loadGSE = () =>{

		let workflow = Object.assign({},this.state.workflow);
		let reqBody = {};
		reqBody.code="";
		reqBody.projectId="";
		reqBody.groups="";
		reqBody.actions="";
		reqBody.pDEGs="";
		reqBody.foldDEGs="";
		reqBody.pPathways="";

		if(workflow.dataList!=""){
			// user click load after data already loaded.then it is a new transaction 
			window.location.reload(true);
		}
		if(workflow.accessionCode==""){
	    	message.warning('Accession Code is required. ');
	    	return;
	    }
	    reqBody.code = workflow.accessionCode;
	    	

	    // this pid will be used to create a tmp folder to store the data. 
	    // need to validate if it is a validate project
	    if(workflow.projectID===""){
	    	message.warning('Project Id is null, the system will assign one');
	    	workflow.projectID=this.uuidv4();
	    	reqBody.projectId=workflow.projectID;
	    }else{
	    	 reqBody.projectId=workflow.projectID;
	    }
	   
	   	// gruop info
	   	var groups=[]
		for(var i in workflow.dataList){
			if(workflow.dataList[i].group==""){
				groups.push("Ctl")
			}else{
				groups.push(workflow.dataList[i].group)
			}
		}
		reqBody.groups = groups;
		// disable the input , prevent user to change the project id
	    document.getElementById("input-project-name").disabled=true

	    
	    // define action
	    reqBody.actions = "loadGSE";

	    workflow.uploading = true;
		workflow.progressing = true;
	    workflow.loading_info = "Loading GEO Data...";
	    this.setState({
		      workflow:workflow
		 });
	    
	    
	    fetch('./api/analysis/run',{
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: {
		        'Content-Type': 'application/json'
		    }
		})
			.then(res => res.json())
			.then(result => {
			if(result.status==200){
				var data = result.data.split("+++loadGSE+++\"")[1]
				let list =JSON.parse(decodeURIComponent(data));
				//let list = result.data;
				workflow.uploading = false;
				workflow.progressing = false;
				if(list.files==null||typeof(list.files)=="undefined"||list.files.length==0){
					message.success('load data fails.');
					return;
				}
				workflow.dataList = list.files;
				// init group with default value
				workflow.group = new Array(list.files.length).fill('Ctl');

				// disable the input , prevent user to change the access code
	    		document.getElementById("input-access-code").disabled=true

	    		// change the word of load btn
	    		document.getElementById("btn-project-load-gse").disabled=true


				this.setState({
			      workflow:workflow
			    });
			    message.success('load successfully.');

			    }else{
					 message.success('load data fails.');	
				}
			});
	}

	runContrast = () =>{
		let workflow = Object.assign({},this.state.workflow);
		let reqBody = {};
		reqBody.code="";
		reqBody.projectId="";
		reqBody.groups="";
		reqBody.actions="";
		reqBody.pDEGs="";
		reqBody.foldDEGs="";
		reqBody.pPathways="";

		reqBody.code = workflow.accessionCode;
		reqBody.projectId = workflow.projectID;
		reqBody.groups =[];
		for(var i in workflow.dataList){
			if(workflow.dataList[i].groups!=""){
				reqBody.groups.push(workflow.dataList[i].groups)
			}else{
				// default value of the group is Ctl
				reqBody.groups.push("Ctl")
			}
		}

		if(workflow.pDEGs==""||workflow.foldDEGs==""||workflow.pPathways==""){
	    	message.warning('All the threshold is required!');
	    	return;
	    }
		reqBody.pDEGs = workflow.pDEGs;
		reqBody.foldDEGs = workflow.foldDEGs;
		reqBody.pPathways = workflow.pPathways;

		workflow.progressing = true;
		workflow.loading_info = "Running Contrast... (this might take a few minutes)";
		 // define action
	    reqBody.actions = "runContrast";
	    this.setState({
	      workflow:workflow
	    });
	    fetch('./api/analysis/run',{
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
					 var d =result.data.split("+++ssGSEA+++\"")[1];
					 let list =JSON.parse(decodeURIComponent(d));
					 // too many record, shows first 1000
					 workflow.diff_expr_genes=list.listData.diff_expr_genes.listDEGs["RNA_1-Ctl"].slice(1, 1000);
					 workflow.ssGSEA=list.listData.ssGSEA.ssgsResults;
					 workflow.pathways_up=list.listData.pathways_down['RNA_1-Ctl']['upregulated_pathways'].slice(1, 1000);
					 workflow.pathways_down=list.listData.pathways_down['RNA_1-Ctl']['downregulated_pathways'].slice(1, 1000);
				     var plots=list.listData.norm_celfiles.listData;
						workflow.progressing = false;
						workflow.HistplotBN = plots[0];                  // svg file
						workflow.MAplotBN =plots[1].listData;			// images list[jpg]
						workflow.BoxplotBN = plots[2];					// svg file
						workflow.RLEplotBN = plots[3];					// svg file
						workflow.NUSEplotBN = plots[4];					// svg file
						workflow.HistplotAN = plots[5];					// svg file
						workflow.MAplotAN = plots[6].listData;			// images list[jpg]
						workflow.BoxplotAN = plots[7];					// svg file
						workflow.PCA = plots[8];							// html file
						workflow.Heatmapolt = plots[9];	
						// hard code the path for plot
						workflow.pathwayHeatMap="/geneHeatmap.jpg";
						workflow.volcanoPlot="/volcano.html";				// html file
						workflow.compared=true;
						workflow.done_gsea=true;
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
			      <Workflow data={this.state.workflow} resetWorkFlowProject={this.resetWorkFlowProject}  changeProject={this.changeProject} 
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