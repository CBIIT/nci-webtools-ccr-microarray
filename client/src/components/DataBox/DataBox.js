import React, { Component } from 'react';
import { Tabs, Table, Button, Input, Modal, message } from 'antd';
import DEGBox from './DEGBox'
import GSMData from './GSMData'
import PrePlotsBox from './PrePlotsBox'
import PostPlotsBox from './PostPlotsBox'
import SSGSEATable from './SSGSEATable'
const TabPane = Tabs.TabPane;

class DataBox extends Component {

    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            group: "",
            loading: false,
            visible: false,
            selected: []
        }
    }


    update() {

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
        this.setState({ group: "", selected: [], visible: false });
    }

    selection = (selectedRowKeys) => {
        this.setState({ selected: selectedRowKeys });
    }

    createTag = () => {
        if (document.getElementById("input_group_name").value == "") {
            // alert 
            message.warning('Please type the tag name. ');
        } else {
            if (this.state.selected.length > 0) { // if user select records in table 
                this.props.assignGroup(document.getElementById("input_group_name").value, this.state.selected)
                this.child.current.unselect(); // after create tag, previous selected record will unselect. 
            } else {
                message.warning('Please select some gsm(s). ');
            }
        }
    }

    deleteTag = (event) => {
        console.log("delete");
        var group_name = event.target.parentNode.parentNode.getElementsByTagName("td")[0].innerText;
        if (group_name == "" || typeof(group_name) == 'undefined') {
            message.warning('No group selected for deleting.');
        } else {
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
        if (this.props.data.dataList.length > 0) {
            define_group_click_btn = <div><Button  type="primary" onClick={this.showModal} >Manage Group</Button></div>;
        }

        if (this.props.data.compared) {
            // controll display fo tags[preplot,postplot,DEG]
            prePlotsBox = (<TabPane tab="Pre-Normalization QC Plots"  key="Pre-normalization_QC_Plots">
                <PrePlotsBox key="prePlotsBox" 
                    getHistplotBN={this.props.getHistplotBN}
                    getMAplotsBN={this.props.getMAplotsBN}
                    getBoxplotBN={this.props.getBoxplotBN}
                    getRLE={this.props.getRLE}
                    getNUSE={this.props.getNUSE}
                    data={this.props.data} 
                    upateCurrentWorkingTabAndObject={this.props.upateCurrentWorkingTabAndObject}
                />
                </TabPane>);
            postPlotsBox = (<TabPane tab="Post-Normalization Plots"  key="Post-normalization_Plots">
                <PostPlotsBox  key="postPlotsBox" 
                     getBoxplotAN={this.props.getBoxplotAN}
                     getMAplotAN={this.props.getMAplotAN}
                     getHistplotAN={this.props.getHistplotAN}
                     getPCA={this.props.getPCA}
                     getHeatmapolt={this.props.getHeatmapolt}
                     data={this.props.data} 
                     upateCurrentWorkingTabAndObject={this.props.upateCurrentWorkingTabAndObject} 
                /></TabPane>);
            degBox = (<TabPane tab="DEG-Enrichments Results"  key="DEG-Enrichments_Results">
                <DEGBox  key="degBox" data={this.props.data} 
                         getDEG={this.props.getDEG}
                         getPathwayUp={this.props.getPathwayUp}
                         getPathwayDown={this.props.getPathwayDown}
                         changeDeg={this.props.changeDeg} 
                         changePathways_up={this.props.changePathways_up}
                         changePathways_down={this.props.changePathways_down}
                         upateCurrentWorkingTabAndObject={this.props.upateCurrentWorkingTabAndObject}/></TabPane>);
        } else {
            // controll display fo tags[preplot,postplot,DEG]
            prePlotsBox = (<TabPane tab="Pre-Normalization QC Plots" disabled key="Pre-normalization_QC_Plots" >No data </TabPane>);
            postPlotsBox = (<TabPane tab="Post-Normalization Plots" disabled key="Post-normalization_Plots" >No data</TabPane>);
            degBox = (<TabPane tab="DEG-Enrichments Results" disabled key="DEG-Enrichments_Results" >No data</TabPane>);
        }
        // control tab  SSGSEA
        if (this.props.data.done_gsea) {
            ssGSEABox = (<TabPane tab="ssGSEA Results" key="ssGSEA_Results">
                <SSGSEATable  getssGSEA={this.props.getssGSEA} changessGSEA={this.props.changessGSEA} key="ssgseaTable" data={this.props.data} upateCurrentWorkingTabAndObject={this.props.upateCurrentWorkingTabAndObject}/></TabPane>);
        }

        var selected_gsms = "";
        for (var key in this.state.selected) {
            selected_gsms = selected_gsms + this.props.data.dataList[this.state.selected[key] - 1].gsm + ",";
        }
        // define group list in the modal
        const columns = [ // define table column names
            { title: 'Group', dataIndex: 'name', key: 'name', width: 90 },
            { title: 'Metabolite IDs', dataIndex: 'gsms', key: 'gsms' },
            { title: 'Action', dataIndex: 'name', key: 'key', width: 90, render: (e) => (<a href="javascript:;" onClick={(e) => this.deleteTag(e)}>Delete</a>) }
        ];

        // get group and gsm(s)  [{grupa: gsm1,gsm2,gsm3}]
        var groups_data = new Map();
        for (var key in this.props.data.dataList) {
            if (this.props.data.dataList[key].groups != "") {
                if (groups_data.has(this.props.data.dataList[key].groups)) {
                    groups_data.set(this.props.data.dataList[key].groups, groups_data.get(this.props.data.dataList[key].groups) + this.props.data.dataList[key].gsm + ",")
                } else {
                    groups_data.set(
                        this.props.data.dataList[key].groups,
                        this.props.data.dataList[key].gsm + ","
                    )
                }
            }
        }

        var groups_data_list = [];
        groups_data.forEach(function(value, key, map) {
            var d = { 'key': key, 'name': key, 'gsms': value };
            groups_data_list.push(d);
        })
        let group_table = <Table
    columns={columns}
    dataSource={groups_data_list} 
    />

        // define group modal
        let modal = <Modal key="group_define_modal" visible={visible}  title="Manage GSM Group(s)" onOk={this.handleOk} onCancel={this.handleCancel}
        footer={[
            <Button key="back" onClick={this.handleCancel}>Close</Button>,
          ]}
        >
          <p><b>Provide a Group name for the following selected GSM(s)</b></p>
          
          <p>{selected_gsms}</p>
          <p>Group Name:&nbsp;&nbsp;
              <Input placeholder={"Group Name"} id={"input_group_name"} style={{width:'150px'}}/>&nbsp;
              <Button  type="primary" onClick={this.createTag} >Add</Button>
          </p>
           <p><small>*Group name should start with letter and can combine with number. Ex. RNA_1 </small></p>
          <b>Saved Group List:</b> <br/>
          {group_table}
        </Modal>
        // end  group modal

        let content = (<Tabs onChange={this.handleTabChange} type="card" >
                      <TabPane tab="GSM Data" key="GSM_1">
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