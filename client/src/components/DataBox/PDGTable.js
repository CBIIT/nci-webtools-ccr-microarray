import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Table, Input, message, Modal, Button, Tooltip } from 'antd';
const Search = Input.Search;
const minWidth = 110;
const exponentialNum = 3;

class PUGTable extends Component {


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

    search = (value) => {
        this.props.changePathways_down({
            loading: true,
            data: []
        })

        this.props.getPathwayDown({
            search_keyword: value
        });
    }

    componentDidCatch(error, info) {
        document.getElementById("message-pdg").innerHTML = error;

    }

    handleMenuClick = (e) => {
        document.getElementById("pd-drop-down").innerHTML = e.key
        this.props.getPathwayDown({
            page_size: parseInt(e.key),
            page_number: 1,
            sorting: {
                name: this.props.data.pathways_down.sorting.name,
                order: this.props.data.pathways_down.sorting.order,
            },
            search_keyword: this.props.data.pathways_down.search_keyword
        });
    }


    handleExportMenuClick =(e)=>{
        if(e.key ==1 ){
            this.props.exportPathwayDown();
        }else{
            this.props.exportNormalAll();
        }
    }


    handleTableChange = (pagination, filters, sorter) => {

        this.props.getPathwayDown({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: this.props.data.pathways_down.sorting,
            search_keyword: this.props.data.pathways_down.search_keyword
        });
    }


    sorter = (field, order) => {

        if (!field) {
            field = "P_Value"
        }

        if (!order) {
            order = "ascend"
        }

        this.props.getPathwayDown({
            page_size: this.props.data.pathways_down.pagination.pageSize,
            page_number: this.props.data.pathways_down.pagination.current,
            sorting: {
                name: field,
                order: order,
            },
            search_keyword: this.props.data.pathways_down.search_keyword
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


    showHeatMap(idx) {
        // not reflected in interface 
        let reqBody = {};
        reqBody.projectId = this.props.data.projectID;
        reqBody.group1 = this.props.data.group_1;
        reqBody.group2 = this.props.data.group_2;
        reqBody.upOrDown = "downregulated_pathways";
        reqBody.pathway_name = this.props.data.pathways_down.data[idx.index].Description;
        this.props.changeLoadingStatus(true, "loading HeatMap")
        var importantStuff = window.open(window.location.origin+"/assets/loading.html", '_blank');

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
                    if (Object.keys(result.data).length == 0 || result.data.constructor == Object) {

                        importantStuff.location.href = window.location.origin+"/assets/noheatmap.html";


                    } else {
                        let pic_link = JSON.parse(result.data).pic_name
                        var link = "images/" + this.props.data.projectID + "/" + pic_link
                        importantStuff.location.href = window.location.origin+"/" + link;

                    }


                } else {
                    message.success('no rows to aggregate');
                }

            })


    }



    render() {

        const { visible } = this.state;
        let content = "";

        const columns = [{
                title: (
                    <div className="pathway_pathways_id_head" >
                      <label htmlFor="input_pathway_down_search_PATHWAY_ID"><span style={{display:"none"}}>input_pathway_down_search_PATHWAY_ID</span>
                      <Input aria-label="input_pathway_down_search_PATHWAY_ID"  onPressEnter={value=>search(value) }  placeholder="PATHWAY_ID"  id="input_pathway_down_search_PATHWAY_ID"/></label>
                        <div>   
                            <div  className="head-title"> PATHWAY_ID</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Pathway_ID"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Pathway_ID","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Pathway_ID"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Pathway_ID","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Pathway_ID',
                width: "10%",
                key: 'Pathway_ID',
                sorter: false,
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1:minWidth}}>
                                       <span style={{"color":"rgb(0, 0, 255)"}} data-toggle="tooltip" data-placement="left" title={text}><a style={{"color":"rgb(0, 0, 255)"}} onClick ={()=>this.showHeatMap({index})}>{text}</a></span>
                                    </div>

                }

            },
            {
                title: (
                    <div className="pathway_source_head" >
                         <label htmlFor="input_pathway_down_search_SOURCE"><span style={{display:"none"}}>input_pathway_down_search_SOURCE</span>
                         <Input aria-label="input_pathway_down_search_SOURCE" onPressEnter={value=>search(value) }  placeholder="source"  id="input_pathway_down_search_SOURCE"/></label>
                          <div>   
                            <div  className="head-title"> SOURCE</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Source"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Source","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Source"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Source","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Source',
                width: "9%",
                key: 'Source',
                sorter: false,
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            },
            {
                title: (
                    <div className="pathway_desc_head" >
                    <label htmlFor="input_pathway_down_search_DESCRIPTION"><span style={{display:"none"}}>input_pathway_down_search_DESCRIPTION</span>
                    <Input aria-label="input_pathway_down_search_DESCRIPTION" onPressEnter={value=>search(value) }  placeholder="desc"  id="input_pathway_down_search_DESCRIPTION"/></label>
                      <div>   
                            <div  className="head-title"> DESCRIPTION</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Description"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Description","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Description"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Description","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Description',
                width: "10%",
                key: 'Description',
                sorter: false,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1:minWidth}}>
                        <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: (
                    <div className="pathway_type_head" >
                       <label htmlFor="input_pathway_down_search_TYPE"><span style={{display:"none"}}>input_pathway_down_search_TYPE</span>
                       <Input  aria-label="input_pathway_down_search_TYPE"  onPressEnter={value=>search(value) }    placeholder="type"  id="input_pathway_down_search_TYPE"/></label>
                         <div>   
                            <div  className="head-title"> TYPE</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Type"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Type","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Type"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Type","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Type',
                width: "10%",
                key: 'Type',
                sorter: false,
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_p_value_head" >
                  <label htmlFor="input_pathway_down_search_p_value"><span style={{display:"none"}}>input_pathway_down_search_p_value</span>
                  <Input aria-label="input_pathway_down_search_p_value"  onPressEnter={value=>search(value) }    placeholder="P_Value"  id="input_pathway_down_search_p_value"/></label>
                                   <div>   
                            <div  className="head-title"> P_VALUE</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="P_Value"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("P_Value","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="P_Value"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("P_Value","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'P_Value',
                width: "8%",
                key: 'P_Value',
                sorter: false,
                defaultSortOrder: 'ascend',
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{Number.parseFloat(text).toExponential(exponentialNum)}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_fdr_head" >
                       <label htmlFor="input_pathway_down_search_fdr"><span style={{display:"none"}}>input_pathway_down_search_fdr</span>
                       <Input aria-label="input_pathway_down_search_fdr"   onPressEnter={value=>search(value) }    placeholder="FDR"  id="input_pathway_down_search_fdr"/></label>
                         <div>   
                            <div  className="head-title"> FDR</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="FDR"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("FDR","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="FDR"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("FDR","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'FDR',
                width: "7%",
                key: 'FDR',
                sorter: false,
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{Number.parseFloat(text).toExponential(exponentialNum)}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_ratio_head" >
                       <label htmlFor="input_pathway_down_search_RATIO"><span style={{display:"none"}}>input_pathway_down_search_RATIO</span>
                       <Input aria-label="input_pathway_down_search_RATIO" onPressEnter={value=>search(value) }   placeholder="Ratio"  id="input_pathway_down_search_RATIO"/></label>
                          <div>   
                            <div  className="head-title"> RATIO</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Ratio"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Ratio","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Ratio"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Ratio","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Ratio',
                width: "7%",
                key: 'Ratio',
                sorter: false,
                render: (text, record, index) => {
                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_gene_list_head" >
                     <label htmlFor="input_pathway_down_search_GENE_LIST"><span style={{display:"none"}}>input_pathway_down_search_GENE_LIST</span>
                     <Input aria-label="input_pathway_down_search_GENE_LIST" onPressEnter={value=>search(value) }  placeholder="GENE_LIST"  id="input_pathway_down_search_GENE_LIST"/></label>
                        <div>   
                            <div  className="head-title"> GENE_LIST</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Gene_List"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Gene_List","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Gene_List"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Gene_List","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Gene_List',
                width: "10%",
                key: 'Gene_List',
                sorter: false,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1:minWidth}}>
                         <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: (
                    <div className="pathway_number_hits_head" >
                           <label htmlFor="input_pathway_down_search_NUMBER_HITS"><span style={{display:"none"}}>input_pathway_down_search_NUMBER_HITS</span>
                           <Input aria-label="input_pathway_down_search_NUMBER_HITS" onPressEnter={value=>search(value) }   placeholder="HITS"  id="input_pathway_down_search_NUMBER_HITS"/></label>
                               <div>   
                            <div  className="head-title"> NUMBER_HITS</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_Hits"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Number_Hits","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_Hits"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Number_Hits","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Number_Hits',
                width: "7%",
                key: 'Number_Hits',
                sorter: false,
                render: (text, record, index) => {
             
                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_number_genes_pathway_head" >
                         <label htmlFor="input_pathway_down_search_NUMBER_GENES_PATHWAY"><span style={{display:"none"}}>input_pathway_down_search_NUMBER_GENES_PATHWAY</span>
                         <Input  aria-label="input_pathway_down_search_NUMBER_GENES_PATHWAY"  onPressEnter={value=>search(value) }   placeholder="GENES_PATHWAY"  id="input_pathway_down_search_NUMBER_GENES_PATHWAY"/></label>
                           <div>   
                            <div  className="head-title"> NUMBER_GENES_PATHWAY</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_Genes_Pathway"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Number_Genes_Pathway","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_Genes_Pathway"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Number_Genes_Pathway","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Number_Genes_Pathway',
                width: "7%",
                key: 'Number_Genes_Pathway',
                sorter: false,
                render: (text, record, index) => {
        
                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: (
                    <div className="pathway_number_user_genes_head" >
                        <label htmlFor="input_pathway_down_search_NUMBER_USER_GENES"><span style={{display:"none"}}>input_pathway_down_search_NUMBER_USER_GENES</span>
                        <Input  aria-label="input_pathway_down_search_NUMBER_USER_GENES"  onPressEnter={value=>search(value) }   placeholder="USER_GENES"  id="input_pathway_down_search_NUMBER_USER_GENES"/></label>
                          <div>   
                            <div  className="head-title"> NUMBER_USER_GENES</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_User_Genes"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Number_User_Genes","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Number_User_Genes"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Number_User_Genes","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Number_User_Genes',
                width: "7%",
                key: 'Number_User_Genes',
                sorter: false,
                render: (text, record, index) => {
                 
                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            }, {
                title: (
                    <div className="pathway_total_number_genes_head" >
                       <label htmlFor="input_pathway_down_search_TOTAL_NUMBER_GENES"><span style={{display:"none"}}>input_pathway_down_search_TOTAL_NUMBER_GENES</span>
                       <Input  aria-label="input_pathway_down_search_TOTAL_NUMBER_GENES" onPressEnter={value=>search(value) }   placeholder="GENES"  id="input_pathway_down_search_TOTAL_NUMBER_GENES"/></label>
                          <div>   
                            <div  className="head-title"> TOTAL_NUMBER_GENES</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Total_Number_Genes"&&this.props.data.pathways_down.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("Total_Number_Genes","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.pathways_down.sorting.name=="Total_Number_Genes"&&this.props.data.pathways_down.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("Total_Number_Genes","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'Total_Number_Genes',
                width: "8%",
                key: 'Total_Number_Genes',
                sorter: false,
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            }
        ];

        // define group modal
        let modal = <Modal width={"75%"} visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Close</Button>
              ]}
            >
              <img src={this.state.heapMap} style={{width:"100%"}} alt="heatMap"/>
            </Modal>
        // end  group modal



        const search = (e) => {

            var search_PATHWAY_ID = document.getElementById("input_pathway_down_search_PATHWAY_ID").value;
            var search_SOURCE = document.getElementById("input_pathway_down_search_SOURCE").value;
            var search_DESCRIPTION = document.getElementById("input_pathway_down_search_DESCRIPTION").value;
            var search_TYPE = document.getElementById("input_pathway_down_search_TYPE").value;
            var search_p_value = document.getElementById("input_pathway_down_search_p_value").value;
            var search_fdr = document.getElementById("input_pathway_down_search_fdr").value;
            var search_RATIO = document.getElementById("input_pathway_down_search_RATIO").value;
            var search_GENE_LIST = document.getElementById("input_pathway_down_search_GENE_LIST").value;
            var search_NUMBER_HITS = document.getElementById("input_pathway_down_search_NUMBER_HITS").value;
            var search_NUMBER_GENES_PATHWAY = document.getElementById("input_pathway_down_search_NUMBER_GENES_PATHWAY").value;
            var search_NUMBER_USER_GENES = document.getElementById("input_pathway_down_search_NUMBER_USER_GENES").value;
            var search_TOTAL_NUMBER_GENES = document.getElementById("input_pathway_down_search_TOTAL_NUMBER_GENES").value;


            this.props.getPathwayDown({
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
                    "search_p_value": Number(search_p_value),
                    "search_fdr": Number(search_fdr),
                    "search_RATIO": search_RATIO,
                    "search_GENE_LIST": search_GENE_LIST,
                    "search_NUMBER_HITS": Number(search_NUMBER_HITS),
                    "search_NUMBER_GENES_PATHWAY": Number(search_NUMBER_GENES_PATHWAY),
                    "search_NUMBER_USER_GENES": Number(search_NUMBER_USER_GENES),
                    "search_TOTAL_NUMBER_GENES": Number(search_TOTAL_NUMBER_GENES),
                }
            })
        }

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="15">15</Menu.Item>
                    <Menu.Item key="25">25</Menu.Item>
                    <Menu.Item key="50">50</Menu.Item>
                    <Menu.Item key="100">100</Menu.Item>
                    <Menu.Item key="200">200</Menu.Item>
                </Menu>
        );


        const ExportMenu = (
            <Menu onClick={this.handleExportMenuClick}>
                    <Menu.Item key="1">Pathways for Downregulated Genes Table Results</Menu.Item>
                    <Menu.Item key="2">Normalized Data</Menu.Item>
            </Menu>
        );



        content = <div>
                     <div>
                        <p className="err-message" id="message-pdg"></p>
                    </div>  
                     <div  className="div-export-pathwayDown">
                           <Dropdown  overlay={ExportMenu}>
                                          <Button type="primary" id="btn-pathwayDown-export" >
                                            <span id="pd-export-drop-down">Export</span> <Icon type="down" />
                                          </Button>
                           </Dropdown>
                    </div>

                    <div>
                             <div id="pathways-down-select">Display &nbsp;
                                <Dropdown overlay={menu}>
                                      <Button >
                                        <span id="pd-drop-down">25</span> <Icon type="down" />
                                      </Button>
                                </Dropdown>&nbsp;of total {this.props.data.pathways_down.pagination.total} records

                            </div>
                         
                    </div>
                  <div>
                    <Table 
                        columns={columns}
                        dataSource={this.props.data.pathways_down.data}
                        pagination={this.props.data.pathways_down.pagination}
                        loading={this.props.data.pathways_down.loading}
                        onChange={this.handleTableChange}
                        scroll={{ x: 600}}
                        />
                    {modal}
                    </div>
                </div>

        return content;
    }
}

export default PUGTable;