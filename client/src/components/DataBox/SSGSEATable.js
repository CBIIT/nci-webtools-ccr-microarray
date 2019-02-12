import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, Table, Input, Tooltip } from 'antd';


class SSGSEATable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSelectionChange = this.handleSelectionChange.bind(this)

    }


    handleMenuClick = (e) => {
        document.getElementById("ss-drop-down").innerHTML = e.key
        this.props.getssGSEA({
            page_size: parseInt(e.key),
            page_number: 1,
            sorting: {
                name: this.props.data.ssGSEA.sorting.name,
                order: this.props.data.ssGSEA.sorting.order,
            },
            search_keyword: this.props.data.ssGSEA.search_keyword
        });
    }



    handleTableChange = (pagination, filters, sorter) => {

        if (!sorter) {
            sorter = {
                field: "P.Value",
                rder: "ascend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P.Value"
        }

        if (!sorter.order) {
            sorter.order = "ascend"
        }


        this.props.getssGSEA({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            search_keyword: this.props.data.ssGSEA.search_keyword,
        });
    }


    handleSelectionChange(value) {
        if (value == "ss_tag1") {
            this.props.upateCurrentWorkingTabAndObject("ssGSEA")
        }
        if (value == "ss_tag2") {
            this.props.upateCurrentWorkingTabAndObject("pathwayHeatMap")
        }


        var list = document.getElementsByClassName("ss_plot");
        for (var i = 0; i < list.length; i++) {
            list[i].classList.add("hide");
        }
        document.getElementById(value).className = document.getElementById(value).className.replace("hide", "");
    }


    render() {

        let content = "";


        const columns = [{
            title: (
                    <div style={{ textAlign: 'center' }}>
                       <label htmlFor={"input_ssg_name"}><span style={{display:"none"}}>input_ssg_name</span>
                       <Input aria-label="input_ssg_name" onPressEnter={value=>search(value) }  placeholder="name"  id="input_ssg_name"/></label>
                      <div>NAME</div>
                </div>
                ),
            dataIndex: '_row',
            sorter: true,
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.3}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        }, {
            title: (
                    <div style={{ textAlign: 'center' }}>
                       <label htmlFor="input_ssg_search_logFC"><span style={{display:"none"}}>input_ssg_search_logFC</span>
                       <Input aria-label="input_ssg_search_logFC" onPressEnter={value=>search(value) }    placeholder="logfc"  id="input_ssg_search_logFC"/></label>
                       <div>logFC</div>
                </div>
                ),
            dataIndex: 'logFC',
            sorter: true,
            width: "10%",
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        },{
            title: (
                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="input_ssg_search_p_value"><span style={{display:"none"}}>input_ssg_search_p_value</span>
                        <Input aria-label="input_ssg_search_p_value" onPressEnter={value=>search(value) }   placeholder="p value"  id="input_ssg_search_p_value"/></label>
                        <div>P.Value</div>
                </div>
                ),
            dataIndex: 'P.Value',
            sorter: true,
            width: "10%",
            defaultSortOrder: 'ascend',
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        },{
            title:  (
                    <div style={{ textAlign: 'center' }}>
                          <label htmlFor="input_ssg_search_adj_p_value"><span style={{display:"none"}}>input_ssg_search_adj_p_value</span>
                          <Input aria-label="input_ssg_search_adj_p_value" onPressEnter={value=>search(value) }   placeholder="adj.P.val"  id="input_ssg_search_adj_p_value"/></label>
                     <div>adj.P.Vale</div>
                </div>
                ),
            dataIndex: 'adj.P.Val',
            sorter: true,
            width: "10%",
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        },  {
            title:  (
                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="input_ssg_search_Avg_Enrichment_Score"><span style={{display:"none"}}>input_ssg_search_Avg_Enrichment_Score</span>
                        <Input aria-label="input_ssg_search_Avg_Enrichment_Score" onPressEnter={value=>search(value) }    placeholder="Avg.enrichment.Score"  id="input_ssg_search_Avg_Enrichment_Score"/></label>
                        <div>Avg.Enrichment.Score</div>
                </div>
                ),
            dataIndex: 'Avg.Enrichment.Score',
            sorter: true,
            width: "20%",
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.2}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        }, {
            title:  (
                    <div style={{ textAlign: 'center' }}>
                       <label htmlFor="input_ssg_search_t"><span style={{display:"none"}}>input_ssg_search_t</span><Input onPressEnter={value=>search(value) }   placeholder="t"  id="input_ssg_search_t"/></label>
                        <div>t</div>
                </div>
                ),
            dataIndex: 't',
            sorter: true,
            width: "10%",
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        },  {
            title:  (
                    <div style={{ textAlign: 'center' }}>
                         <label htmlFor="input_ssg_search_b"><span style={{display:"none"}}>input_ssg_search_b</span>
                         <Input aria-label="input_ssg_search_b"  onPressEnter={value=>search(value) }   placeholder="B"  id="input_ssg_search_b"/></label>
                         <div>B</div>
                </div>
                ),
            dataIndex: 'B',
            sorter: true,
            width: "10%",
            render: (text, record, index) => {

                return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

            }
        }, ];


        const search = (e) => {
            var search_name = document.getElementById("input_ssg_name").value;
            var search_logFC = document.getElementById("input_ssg_search_logFC").value;
            var search_Avg_Enrichment_Score = document.getElementById("input_ssg_search_Avg_Enrichment_Score").value;
            var search_t = document.getElementById("input_ssg_search_t").value;
            var search_p_value = document.getElementById("input_ssg_search_p_value").value;
            var search_adj_p_value = document.getElementById("input_ssg_search_adj_p_value").value;
            var search_b = document.getElementById("input_ssg_search_b").value;

            this.props.getssGSEA({
                page_size: 25,
                page_number: 1,
                sorting: {
                    name: "P.Value",
                    order: "ascend",
                },
                search_keyword: {
                    "name": search_name,
                    "search_logFC": search_logFC,
                    "search_Avg_Enrichment_Score": search_Avg_Enrichment_Score,
                    "search_t": search_t,
                    "search_p_value": search_p_value,
                    "search_adj_p_value": search_adj_p_value,
                    "search_b": search_b,
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


        let link = "./images/" + this.props.data.projectID + this.props.data.geneHeatmap

        let selection = [<div id={"ss_genset_select"}>     <select defaultValue="human$H: Hallmark Gene Sets" 
                        id="ssGSEA_genset"
                        onChange={(e) => this.props.handleGeneChange(e)} 
                        aria-label="Gene Set For ssGSEA"
                      >
                        <optgroup label="Human">
                          <option value="human$H: Hallmark Gene Sets">H: Hallmark Gene Sets</option>
                          <option value="human$C1: Positional Gene Sets">C1: Positional Gene Sets</option>
                          <option value="human$C2: Curated Gene Sets">C2: Curated Gene Sets</option>
                          <option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</option>
                          <option value="human$C4: Computational Gene Sets">C4: Computational Gene Sets</option>
                          <option value="human$C5: GO gene sets">C5: GO gene sets</option>
                          <option value="human$C6: Oncogenic Signatures">C6: Oncogenic Signatures</option>
                          <option value="human$C7: Immunologic Signatures">C7: Immunologic Signatures</option>
                        </optgroup>
                        <optgroup label="Mouse">
                          <option value="mouse$Co-expression">Co-expression</option>
                          <option value="mouse$Gene Ontology">Gene Ontology</option>
                          <option value="mouse$Curated Pathway">Curated Pathway</option>
                          <option value="mouse$Metabolic">Metabolic</option>
                          <option value="mouse$TF targets">TF targets</option>
                          <option value="mouse$miRNA targets">miRNA targets</option>
                          <option value="mouse$Location">Location</option>
                        </optgroup>
                      </select></div>]

        let tabs = [
            <div id="ss_tag1" className="ss_plot">
                 
                          <div>
                                <p className="err-message" id="message-ssgsea"></p>
                          </div>  
                          <div  className="div-export-ss">
                                <Button   id="btn-ss-export"   type="primary" onClick={this.props.exportGSEA}> Export</Button>
                          </div>
                          <div id="ss-select">Display  &nbsp;&nbsp;  
                                <Dropdown overlay={menu}>
                                      <Button >
                                        <span id="ss-drop-down">25</span> <Icon type="down" />
                                      </Button>
                                </Dropdown> &nbsp;  of total {this.props.data.ssGSEA.pagination.total} records

                         </div>
                         <div>
                  
                          <Table 
                                columns={columns}
                                dataSource={this.props.data.ssGSEA.data}
                                pagination={this.props.data.ssGSEA.pagination}
                                loading={this.props.data.ssGSEA.loading}
                                onChange={this.handleTableChange}
                                scroll={{ x: 960}}
                                />
                     </div>
            </div>,
            <div id="ss_tag2" className="ss_plot hide" >
                                  <br/><br/>
                                 <img src= {link}  style={{width:"100%"}} alt="Pathway Heatmap"/>
                            </div>
        ]
        content = [<Select defaultValue="ss_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <option value="ss_tag1">Single Sample GSEA</option>
                                  <option value="ss_tag2">Pathway Heatmap</option>
                                </Select>, selection, tabs]


        return content;
    }
}

export default SSGSEATable;