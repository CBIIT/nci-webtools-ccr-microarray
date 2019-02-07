import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Table, Select, Input, message, Modal, Button, Tooltip } from 'antd';
const Search = Input.Search;




class PUGTable extends Component {

    // term: search keywords
    constructor(props) {
        super(props);

        this.state = {
            term: "",
            heapMap: "",
            visible: false,
            table_content: ""
        }

        this.handleTableChange = this.handleTableChange.bind(this)
        this.showHeatMap = this.showHeatMap.bind(this)

    }



    handleMenuClick = (e) => {
         document.getElementById("pu-drop-down").innerHTML=e.key
         this.props.getPathwayUp({
             page_size: parseInt(e.key),
            page_number: 1,
            sorting: {
                name: this.props.data.pathways_up.sorting.name,
                order: this.props.data.pathways_up.sorting.order,
            },
            search_keyword: this.props.data.pathways_up.search_keyword
        });
    }



    handleTableChange = (pagination, filters, sorter) => {

        if (!sorter) {
            sorter = {
                field: "P_Value",
                rder: "ascend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P_Value"
        }

        if (!sorter.order) {
            sorter.order = "ascend"
        }


        this.props.getPathwayUp({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            search_keyword: this.props.data.pathways_up.search_keyword,
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


    showHeatMap(row, idx, event) {
        // not reflected in interface 
        let reqBody = {};
        reqBody.projectId = this.props.data.projectID;
        reqBody.group1 = this.props.data.group_1;
        reqBody.group2 = this.props.data.group_2;
        reqBody.upOrDown = "upregulated_pathways";
        reqBody.pathway_name = row.Description;
        this.props.changeLoadingStatus(true, "loading HeatMap")

        var importantStuff = window.open(window.location.protocol+"//"+window.location.host+"/microarray/assets/loading.html", '_blank');
        
        fetch('./api/analysis/pathwaysHeapMap', {
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
                this.props.changeLoadingStatus(false, "")
                if (result.status == 200) {
                    if (Object.keys(result.data).length === 0 && result.data.constructor === Object) {

                        message.success('no rows to aggregate');

                    } else {
                        let pic_link = JSON.parse(result.data).pic_name

                        //var link = "./images/" + this.props.data.projectID + "/" + pic_link
                        // this.setState({
                        //     heapMap: link,
                        //     visible: true
                        // });
                        var link = "images/" + this.props.data.projectID + "/" + pic_link
                        //window.open("https://"+window.location.host+"/microarray/"+link);
                        importantStuff.location.href = "https://"+window.location.host+"/microarray/"+link;

                    }

                } else {
                    message.warning('no rows to aggregate');
                }

            })

       
    }




    render() {

        const { visible } = this.state;
        let content = "";


        const columns = [{
            title: 'PATHWAY_ID',
            dataIndex: 'Pathway_ID',
            width: "12%",
            sorter: true,
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.12}}>
                                    <span style={{"color":"#40a9ff"}} data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'SOURCE',
            dataIndex: 'Source',
            width: "9%",
            sorter: true,
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'DESCRIPTION',
            dataIndex: 'Description',
            width: "10%",
            sorter: true,
            render: (text, record, index) => (
                <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                         <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
            ),
        }, {
            title: 'TYPE',
            dataIndex: 'Type',
            width: "7%",
            sorter: true,
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'P_VALUE',
            dataIndex: 'P_Value',
            width: "9%",
            sorter: true,
            defaultSortOrder: 'ascend',
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'FDR',
            dataIndex: 'FDR',
            width: "7%",
            sorter: true,
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'RATIO',
            dataIndex: 'Ratio',
            width: "7%",
            sorter: true,
              render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'GENE_LIST',
            dataIndex: 'Gene_List',
            width: "10%",
            sorter: true,
            render: (text, record, index) => (
                <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                         <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
            ),
        }, {
            title: 'NUMBER_HITS',
            dataIndex: 'Number_Hits',
            width: "7%",
            sorter: true,
            render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

        }, {
            title: 'NUMBER_GENES_PATHWAY',
            dataIndex: 'Number_Genes_Pathway',
            width: "7%",
            sorter: true,
            render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

        }, {
            title: 'NUMBER_USER_GENES',
            dataIndex: 'Number_User_Genes',
            width: "7%",
            sorter: true,
            render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }, {
            title: 'TOTAL_NUMBER_GENES',
            dataIndex: 'Total_Number_Genes',
            width: "8%",
            sorter: true,
            render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
        }];


        const search = (e) => {

            var search_PATHWAY_ID = document.getElementById("input_pathway_up_search_PATHWAY_ID").value;
            var search_SOURCE = document.getElementById("input_pathway_up_search_SOURCE").value;
            var search_DESCRIPTION = document.getElementById("input_pathway_up_search_DESCRIPTION").value;
            var search_TYPE = document.getElementById("input_pathway_up_search_TYPE").value;
            var search_p_value = document.getElementById("input_pathway_up_search_p_value").value;
            var search_fdr = document.getElementById("input_pathway_up_search_fdr").value;
            var search_RATIO = document.getElementById("input_pathway_up_search_RATIO").value;
            var search_GENE_LIST = document.getElementById("input_pathway_up_search_GENE_LIST").value;
            var search_NUMBER_HITS = document.getElementById("input_pathway_up_search_NUMBER_HITS").value;
            var search_NUMBER_GENES_PATHWAY = document.getElementById("input_pathway_up_search_NUMBER_GENES_PATHWAY").value;
            var search_NUMBER_USER_GENES = document.getElementById("input_pathway_up_search_NUMBER_USER_GENES").value;
            var search_TOTAL_NUMBER_GENES = document.getElementById("input_pathway_up_search_TOTAL_NUMBER_GENES").value;

            this.props.getPathwayUp({
                page_size: 25,
                page_number: 1,
                sorting: {
                    name: "P_Value",
                    order: "ascend",
                },
                search_keyword: {
                    "search_PATHWAY_ID": search_PATHWAY_ID,
                    "search_SOURCE": search_SOURCE,
                    "search_DESCRIPTION": search_DESCRIPTION,
                    "search_TYPE": search_TYPE,
                    "search_p_value": search_p_value,
                    "search_fdr": search_fdr,
                    "search_RATIO": search_RATIO,
                    "search_GENE_LIST": search_GENE_LIST,
                    "search_NUMBER_HITS": search_NUMBER_HITS,
                    "search_NUMBER_GENES_PATHWAY": search_NUMBER_GENES_PATHWAY,
                    "search_NUMBER_USER_GENES": search_NUMBER_USER_GENES,
                    "search_TOTAL_NUMBER_GENES": search_TOTAL_NUMBER_GENES,
                }
            })
        }

        // define group modal
        let modal = <Modal width={"75%"} visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Close</Button>,
              ]}
            >
              <img src={this.state.heapMap} style={{width:"100%"}} alt="heatMap"/>
            </Modal>
        // end  group modal



                const menu = (
                <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="15">15</Menu.Item>
                    <Menu.Item key="25">25</Menu.Item>
                    <Menu.Item key="50">50</Menu.Item>
                    <Menu.Item key="100">100</Menu.Item>
                    <Menu.Item key="200">200</Menu.Item>
                </Menu>
            );

        content = <div>
                  <div> <p className="err-message" id="message-pug"></p></div>  
                   <div  className="div-export-pathwayUp"><Button   id="btn-pathwayUp-export"   type="primary" onClick={this.props.exportPathwayUp}> Export</Button> </div>

                        <div id="pathways-up-select">Display &nbsp;
                                <Dropdown overlay={menu}>
                                      <Button >
                                        <span id="pu-drop-down">25</span> <Icon type="down" />
                                      </Button>
                                </Dropdown>&nbsp;of total {this.props.data.pathways_up.pagination.total}  records

                            </div>
                     <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px","paddingBottom": "0px"}}>
                           <div className="filter_col" style={{width:"11%"}} ><label for="input_pathway_up_search_PATHWAY_ID"><span style={{display:"none"}}>input_pathway_up_search_PATHWAY_ID</span><Input onPressEnter={value=>search(value) }  placeholder="PATHWAY_ID"  id="input_pathway_up_search_PATHWAY_ID"/></label></div>
                           <div className="filter_col" style={{width:"9%"}}><label for="input_pathway_up_search_SOURCE"><span style={{display:"none"}}>input_pathway_up_search_SOURCE</span><Input onPressEnter={value=>search(value) }  placeholder="source"  id="input_pathway_up_search_SOURCE"/></label></div>
                           <div className="filter_col" style={{width:"11%"}}><label for="input_pathway_up_search_TYPE"><span style={{display:"none"}}>input_pathway_up_search_TYPE</span><Input onPressEnter={value=>search(value) }  placeholder="desc"  id="input_pathway_up_search_DESCRIPTION"/></label></div>
                           <div className="filter_col" style={{width:"10%"}} ><label for="input_pathway_up_search_TYPE"><span style={{display:"none"}}>input_pathway_up_search_TYPE</span><Input onPressEnter={value=>search(value) }    placeholder="type"  id="input_pathway_up_search_TYPE"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_pathway_up_search_p_value"><span style={{display:"none"}}>input_pathway_up_search_p_value</span><Input onPressEnter={value=>search(value) }    placeholder="P_Value" id="input_pathway_up_search_p_value"/></label></div>
                           <div className="filter_col" style={{width:"7%"}}><label for="input_pathway_up_search_fdr"><span style={{display:"none"}}>input_pathway_up_search_fdr</span><Input onPressEnter={value=>search(value) }    placeholder="FDR"  id="input_pathway_up_search_fdr"/></label></div>
                           <div className="filter_col" style={{width:"6%"}}><label for="input_pathway_up_search_RATIO"><span style={{display:"none"}}>input_pathway_up_search_RATIO</span><Input onPressEnter={value=>search(value) }   placeholder="Ratio"  id="input_pathway_up_search_RATIO"/></label></div>
                           <div className="filter_col" style={{width:"9%"}}><label for="input_pathway_up_search_GENE_LIST"><span style={{display:"none"}}>input_pathway_up_search_GENE_LIST</span><Input onPressEnter={value=>search(value) }  placeholder="GENE_LIST"  id="input_pathway_up_search_GENE_LIST"/></label></div>
                           <div className="filter_col" style={{width:"7%"}}><label for="input_pathway_up_search_NUMBER_HITS"><span style={{display:"none"}}>input_pathway_up_search_NUMBER_HITS</span><Input onPressEnter={value=>search(value) }   placeholder="HITS"  id="input_pathway_up_search_NUMBER_HITS"/></label></div>
                           <div className="filter_col"  style={{width:"7%"}}><label for="input_pathway_up_search_NUMBER_GENES_PATHWAY"><span style={{display:"none"}}>input_pathway_up_search_NUMBER_GENES_PATHWAY</span><Input onPressEnter={value=>search(value) }   placeholder="GENES_PATHWAY"  id="input_pathway_up_search_NUMBER_GENES_PATHWAY"/></label></div>
                           <div className="filter_col" style={{width:"7%"}}><label for="input_pathway_up_search_NUMBER_USER_GENES"><span style={{display:"none"}}>input_pathway_up_search_NUMBER_USER_GENES</span><Input onPressEnter={value=>search(value) }   placeholder="USER_GENES"  id="input_pathway_up_search_NUMBER_USER_GENES"/></label></div>
                           <div className="filter_col" style={{width:"7%"}}><label for="input_pathway_up_search_TOTAL_NUMBER_GENES"><span style={{display:"none"}}>input_pathway_up_search_TOTAL_NUMBER_GENES</span><Input onPressEnter={value=>search(value) }   placeholder="GENES"  id="input_pathway_up_search_TOTAL_NUMBER_GENES"/></label></div>


                    </div>
                     <div>
                     <Table 
                        columns={columns}
                        dataSource={this.props.data.pathways_up.data}
                        pagination={this.props.data.pathways_up.pagination}
                        loading={this.props.data.pathways_up.loading}
                        onChange={this.handleTableChange}
                        onRowClick={this.showHeatMap}
                        scroll={{ x: 960}}
                        />
                    {modal}
                    </div>
                </div>

        return content;
    }
}

export default PUGTable;