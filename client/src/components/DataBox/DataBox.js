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
            selected: [],
            group_name: "",
            used: false
        }
    }



    handleTabChange = (key) => {


        if (key == "Pre-normalization_QC_Plots") {
            let type = this.props.data.tag_pre_plot_status;
            switch (type) {
                case "":
                    if (this.props.data.preplots.histplotBN == "") {
                        this.props.getHistplotBN();
                    }
                    break;
                case "getHistplotBN":
                    if (this.props.data.preplots.histplotBN == "") {
                        this.props.getHistplotBN();
                    }
                    break;
                case "getMAplotsBN":
                    if (this.props.data.preplots.list_mAplotBN == "") {
                        this.props.getMAplotsBN();
                    }
                    break;
                case "getBoxplotBN":
                    if (this.props.data.preplots.Boxplots == "") {
                        this.props.getBoxplotBN();
                    }
                    break;
                case "getRLE":
                    if (this.props.data.preplots.RLE == "") {
                        this.props.getRLE();
                    }
                    break;
                case "getNUSE":
                    if (this.props.data.preplots.NUSE == "") {
                        this.props.getNUSE();
                    }
                    break;
                default:
                    if (this.props.data.preplots.histplotBN == "") {
                        this.props.getHistplotBN();
                    }
            }

        }

        if (key == "Post-normalization_Plots") {
            let type = this.props.data.tag_post_plot_status;
            switch (type) {
                case "":
                    if (this.props.data.postplot.histplotAN == "") {
                        this.props.getHistplotAN();
                    }
                    break;
                case "getHistplotAN":
                    if (this.props.data.postplot.histplotAN == "") {
                        this.props.getHistplotAN();
                    }
                    break;
                case "getBoxplotAN":
                    if (this.props.data.postplot.Boxplots == "") {
                        this.props.getBoxplotAN();
                    }
                    break;
                case "getPCA":
                    if (this.props.data.postplot.PCA == "") {
                        this.props.getPCA();
                    }
                    break;
                case "getHistplotBN":
                    if (this.props.data.postplot.Heatmapolt == "") {
                        this.props.getHistplotBN();
                    }
                    break;

                default:
                    if (this.props.data.postplot.histplotAN == "") {
                        this.props.getHistplotAN();
                    }
            }

        }

        if (key == "DEG-Enrichments_Results") {

            let type = this.props.data.tag_deg_plot_status;
            switch (type) {
                case "":
                    if (this.props.data.diff_expr_genes.data.length == 0) {
                        this.props.getDEG();
                    }
                    break;
                case "pathways_up":
                    if (this.props.data.pathways_up.data.length == 0) {
                        this.props.getPathwayUp();
                    }
                    break;
                case "pathways_down":
                    if (this.props.data.pathways_down.data.length == 0) {
                        this.props.getPathwayDown();
                    }
                    break;
                case "deg":
                    if (this.props.data.diff_expr_genes.data.length == 0) {
                        this.props.getDEG();
                    }
                    break;;

                default:
                    if (this.props.data.diff_expr_genes.data.length == 0) {
                        this.props.getDEG();
                    }
            }



        }

        if (key == "GSM_1") {
            console.log(key)
            // do nothing
        }

        if (key == "ssGSEA_Results") {
            console.log(key)
            // if ssGSEA data length ==0 mean, the result is empty 
            // or user re-run constrast the program clean the data.
            // reload the data in this tag
            if (this.props.data.ssGSEA.data.length == 0) {
                this.props.getssGSEA();
            }
        }

        this.props.upateCurrentWorkingTab(key)

    }

    showModal = () => {


        let group_name = this.state.group_name;
        if (this.state.group_name != "") {

            if (this.state.used) {
                // match the group
                let index_number = parseInt(this.state.group_name.split("_")[1]) + 1
                group_name = "GSMGroup_" + index_number;
                document.getElementById("input_group_name").value = group_name;
            }else{
                group_name = "GSMGroup_";
                document.getElementById("input_group_name").value = group_name;
            }

        }else{
            group_name = "GSMGroup_1";
        }

          this.setState({
                visible: true,
                group_name: group_name,
                used: false
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
        // call child unselect function
        this.child.current.unselect();

    }

    selection = (selectedRowKeys) => {
        this.setState({ selected: selectedRowKeys });
    }

    createTag = () => {
        if (document.getElementById("input_group_name").value == "") {
            // alert 
            message.warning('Please type the tag name. ');
        } else {
            if (this.state.selected.length > 0) {
                // if user select records in table 
                this.props.assignGroup(document.getElementById("input_group_name").value, this.state.selected)
                this.child.current.unselect(); // after create tag, previous selected record will unselect. 

                if (document.getElementById("input_group_name").value == this.state.group_name) {
                    this.setState({
                        used: true
                    });
                }

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
            group_name.tr
            this.props.deleteGroup(group_name.trim())
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
            prePlotsBox = (<TabPane tab="Pre-Normalization QC Plots"  disabled key="Pre-normalization_QC_Plots" > </TabPane>);
            postPlotsBox = (<TabPane tab="Post-Normalization Plots" disabled key="Post-normalization_Plots" ></TabPane>);
            degBox = (<TabPane tab="DEG-Enrichments Results" disabled key="DEG-Enrichments_Results" ></TabPane>);
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
            { title: 'GROUP', dataIndex: 'name', key: 'name', width: 90 },
            { title: 'GMS(s)', dataIndex: 'gsms', key: 'gsms' },
            { title: 'ACTION', dataIndex: 'name', key: 'key', width: 90, render: (e) => (<a href="javascript:;" onClick={(e) => this.deleteTag(e)}>Delete</a>) }
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
        let group_table = <Table columns={columns} dataSource={groups_data_list}  />

        // define group modal
        let modal = <Modal key="group_define_modal" visible={visible}  title="Manage GSM Group(s)" onOk={this.handleOk} onCancel={this.handleCancel}
        footer={[
            <Button key="back" type="primary"  onClick={this.handleCancel}>Close</Button>,
          ]}
        >
          <p style={{color: "#215a82"}}><b>Selected GSM(s)</b></p>
          
          <p>{selected_gsms}</p>
          <p style={{color: "#215a82"}}><b>Group Name:</b> <span style={{color:"red","paddingLeft":"5px"}}> *</span><span style={{color:"#777777"}}>(Must start with an ASCII letter,a-z or A-Z)</span></p>
          <p> <Input  placeholder={"Group Name"} id={"input_group_name"} style={{width:'405px'}} defaultValue="GSMGroup_1"/>&nbsp;
              <Button  type="primary" onClick={this.createTag} >Add</Button>
          </p>
          <p><b style={{color: "#215a82"}}>Saved Group(s) List:</b> </p>
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