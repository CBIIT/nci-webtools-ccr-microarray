import React, { Component } from 'react';
import { Tabs,Table,Button,Input,Modal,message} from 'antd';
import DEGBox from './DEGBox'
import GSMData from './GSMData'
import PrePlotsBox from './PrePlotsBox'
import PostPlotsBox from './PostPlotsBox'
import SSGSEATable from './SSGSEATable'
const TabPane = Tabs.TabPane;

class DataBox extends Component {

	constructor(props){
		super(props);
    this.child = React.createRef();
    this.state={
    group:"",
    loading: false,
    visible: false,
    selected:[]
    }
	}

	componentDidMount(){
	}

	handleTabChange = (key) => {
	  console.log(key);
	}

 showModal = () => {
      this.setState({
        visible: true,
      });
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

  selection =(selectedRowKeys)=>{
    this.setState({ selected: selectedRowKeys });
  }

  createTag=()=>{
     if(document.getElementById("input_group_name").value==""){
      // alert 
       message.warning('Please type the tag name. ');
     }else{
        if(this.state.selected.length>0){  // if user select records in table 
            this.props.assignGroup(document.getElementById("input_group_name").value,this.state.selected)
            this.child.current.unselect(); // after create tag, previous selected record will unselect. 
          }else{
             message.warning('Please select some gsm(s). ');
          }
     }
  }

  deleteTag=(event)=>{
      console.log("delete");
      var group_name = event.target.parentNode.parentNode.getElementsByTagName("td")[0].innerText;
      if(group_name==""||typeof(group_name)=='undefined'){
         message.warning('No group selected for deleting.');
      }else{
        this.props.deleteGroup(group_name)
      }
  }

  render() {

    const { visible, loading } = this.state;
  	let prePlotsBox = "";
  	let postPlotsBox = "";
  	let degBox = "";
  	let ssGSEABox = "";
    let define_group_click_btn = "";

    // define group btn
    if(this.props.data.dataList.length>0){
      define_group_click_btn=<div><Button  type="primary" onClick={this.showModal} >Manage Group</Button></div>;
    }
    
    if(this.props.data.compared){
           // controll display fo tags[preplot,postplot,DEG]
          prePlotsBox = (<TabPane tab="Pre-normalization QC Plots"  key="2"><PrePlotsBox data={this.props.data}/>
                </TabPane>);
          postPlotsBox = (<TabPane tab="Post-normalization Plots"  key="3"><PostPlotsBox data={this.props.data}/></TabPane>);
          degBox = (<TabPane tab="DEG-Enrichments Results"  key="4"><DEGBox data={this.props.data}/></TabPane>);
      }else{
          // controll display fo tags[preplot,postplot,DEG]
          prePlotsBox = (<TabPane tab="Pre-normalization QC Plots" disabled key="2">No data </TabPane>);
          postPlotsBox = (<TabPane tab="Post-normalization Plots" disabled key="3">No data</TabPane>);
          degBox = (<TabPane tab="DEG-Enrichments Results" disabled key="4">No data</TabPane>);
      }
    // control tab  SSGSEA
  	if(this.props.data.done_gsea){
  		ssGSEABox = (<TabPane tab="ssGSEA Results" key="5"><SSGSEATable data={this.props.data}/></TabPane>);	
  	}

    var selected_gsms = ""; 
    for(var key in this.state.selected){
      selected_gsms=selected_gsms+this.props.data.dataList[this.state.selected[key]-1].gsm+",";
    }
    // define group list in the modal
    const columns = [  // define table column names
      { title: 'Group', dataIndex: 'name', key: 'name',width:90},
      { title: 'Metabolite IDs', dataIndex: 'gsms', key: 'gsms' },
      { title: 'Action',dataIndex:'name',width:90,render:(e)=> (<a href="javascript:;" onClick={(e) => this.deleteTag(e)}>Delete</a>)}
    ];

    // get group and gsm(s)  [{grupa: gsm1,gsm2,gsm3}]
    var groups_data= new Map();
    for(var key in this.props.data.dataList){
          if(this.props.data.dataList[key].groups!=""){
            if(groups_data.has(this.props.data.dataList[key].groups)){
                groups_data.set(this.props.data.dataList[key].groups,groups_data.get(this.props.data.dataList[key].groups)+this.props.data.dataList[key].gsm+",")
            }else{
                groups_data.set(
                  this.props.data.dataList[key].groups,
                  this.props.data.dataList[key].gsm+","
                  )
            }
        }
    }

    var groups_data_list=[];
    groups_data.forEach(function(value,key,map){
       var d ={'name':key,'gsms':value};
        groups_data_list.push(d);
    })
    let group_table = <Table
    columns={columns}
    dataSource={groups_data_list} />

    // define group modal
    let modal = <Modal visible={visible}  title="Manage GSM Group(s)" onOk={this.handleOk} onCancel={this.handleCancel}
        footer={[
            <Button key="back" onClick={this.handleCancel}>Close</Button>,
          ]}
        >
          <p><b>Provide a Group name for the following selected GSM(s)</b></p>
           <p><small>*Group name should start with letter and can combine with number. Ex. RNA_1 </small></p>
          <p>{selected_gsms}</p>
          <p>Group Name:&nbsp;&nbsp;
              <Input placeholder={"Group Name"} id={"input_group_name"} style={{width:'150px'}}/>&nbsp;
              <Button  type="primary" onClick={this.createTag} >Add</Button>
          </p>
          <b>Saved Group List:</b> <br/>
          {group_table}
        </Modal>
    // end  group modal

  	let content = (<Tabs onChange={this.handleTabChange} type="card" >
                			<TabPane tab="GSM Data" key="1">
                          {define_group_click_btn}
                          <GSMData ref={this.child}  data={this.props.data} selected={this.selection}/>
                      </TabPane>
              				{prePlotsBox}
              				{postPlotsBox}
              				{degBox}
              				{ssGSEABox}
          					</Tabs>);
  	return (
  	    <div className="container-board-right">
  	    	{content}
          {modal}
  		</div>
  	);
  }
}

export default DataBox;