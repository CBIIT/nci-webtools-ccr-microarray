import React, { Component } from 'react';
import { Tabs,Table,Button,Input,Modal,message} from 'antd';
import GSMData from './GSMData'
import PrePlotsBox from './PrePlotsBox'
import PostPlotsBox from './PostPlotsBox'
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
    
    if(this.state.selected.length>0){  // if user select records in table 

      this.setState({
        visible: true,
      });
    }else{
       message.warning('Please select GSM(s) first');

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

  selection =(selectedRowKeys)=>{
    this.setState({ selected: selectedRowKeys });
  }

  createTag=()=>{
    
     if(document.getElementById("input_group_name").value==""){
      // alert 
       message.warning('Please type the tag name. ');
     }else{
      this.props.assignGroup(document.getElementById("input_group_name").value,this.state.selected)

      this.child.current.unselect(); // after create tag, previous selected record will unselect. 
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
      define_group_click_btn=<div><Button  type="primary" onClick={this.showModal} >Define Group</Button></div>;
    }
    

    // controll display fo tags[preplot,postplot,DEG]
  	if(this.props.data.compared){
    		prePlotsBox = (<TabPane tab="Pre-normalization QC Plots" key="2"><PrePlotsBox data={this.props.data}/>

          </TabPane>);
    		postPlotsBox = (<TabPane tab="Post-normalization Plots" key="3"><PostPlotsBox data={this.props.data}/></TabPane>);
    		degBox = (<TabPane tab="DEG-Enrichments Results" key="4">Content of Tab Pane 3</TabPane>);
  	}


    // control tab  SSGSEA
  	if(this.props.data.done_gsea){
  		ssGSEABox = (<TabPane tab="ssGSEA Results" key="5">Content of Tab Pane 3</TabPane>);	
  	}

  
    var selected_gsms = ""; 
    for(var key in this.state.selected){
      selected_gsms=selected_gsms+this.props.data.dataList[this.state.selected[key]-1].gsm+",";
    }
    // define group modal

    // define group list in the modal
    const columns = [  // define table column names
      { title: 'Tag', dataIndex: 'name', key: 'name' },
      { title: 'Metabolite IDs', dataIndex: 'gsms', key: 'gsms' },
      { title: 'Action', dataIndex:'name', key:'x',render:(e)=> (<a href="javascript:;" onClick={(e) => this.deleteTag(e)}>Delete</a>)},
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




    let modal = <Modal visible={visible}  title="GSM Tag" onOk={this.handleOk} onCancel={this.handleCancel}
        footer={[
            <Button key="back" onClick={this.handleCancel}>Close</Button>,
          ]}
        >
          <h3>Provide a tag name for the following selected GSM(s)</h3>
          <p>{selected_gsms}</p>

          <p>Tag Name:</p>
          <p>
              <Input placeholder={"Tag Name"} id={"input_group_name"} style={{width:'150px'}}/>
              <Button  type="primary" onClick={this.createTag} >Create Tag</Button>
          </p>
          <p>Saved Tag List:</p>
          {group_table}
        </Modal>


    // end  group modal




  	let content = (<Tabs onChange={this.handleTabChange} type="card" tabBarExtraContent={define_group_click_btn}>
    				<TabPane tab="GSM Data" key="1"><GSMData ref={this.child}  data={this.props.data} selected={this.selection}/></TabPane>
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