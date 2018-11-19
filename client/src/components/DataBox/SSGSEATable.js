import React, { Component } from 'react';
import { Table, Select, message, Input } from 'antd';
const { Option, OptGroup } = Select;


class SSGSEATable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSelectionChange = this.handleSelectionChange.bind(this)

    }

    handleTableChange = (pagination, filters, sorter) => {

        if (!sorter) {
            sorter = {
                field: "P.Value",
                rder: "descend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P.Value"
        }

        if (!sorter.order) {
            sorter.order = "descend"
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
            title: 'NAME',
            dataIndex: '_row',
            sorter: true,
            width: "30%"
        }, {
            title: 'logFC',
            dataIndex: 'logFC',
            sorter: true,
            width: "10%"
        }, {
            title: 'Avg.Enrichment.Score',
            dataIndex: 'Avg.Enrichment.Score',
            sorter: true,
            width: "20%"
        }, {
            title: 't',
            dataIndex: 't',
            sorter: true,
            width: "10%"
        }, {
            title: 'P VALUE',
            dataIndex: 'P.Value',
            sorter: true,
            width: "10%"
        }, {
            title: 'adj.P.Val',
            dataIndex: 'adj.P.Val',
            sorter: true,
            width: "10%"
        }, {
            title: 'B',
            dataIndex: 'B',
            sorter: true,
            width: "10%"
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
                page_size: 20,
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


        var link = "./images/" + this.props.data.projectID + this.props.data.geneHeatmap

        let tabs = [<div id="ss_tag1" className="ss_plot">
                        <div>     <Select defaultValue="human$h.all.v6.1.symbols.gmt" 
                        style={{ width: '100%' }}
                        onChange={(e) => this.props.handleGeneChange(e)} 
                        aria-label="Gene Set For ssGSEA"
                      >
                        <OptGroup label="Human">
                          <Option value="human$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="human$C1: Positional Gene Sets">C1: Positional Gene Sets</Option>
                          <Option value="human$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="human$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="human$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="human$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="human$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                        <OptGroup label="Mouse">
                          <Option value="mouse$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="mouse$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="mouse$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="mouse$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="mouse$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="mouse$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="mouse$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                      </Select></div>
                         <div>
                          <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>

                            <div className="filter_col" style={{width:"29%"}} ><Input onPressEnter={value=>search(value) }  placeholder="name"  id="input_ssg_name"/></div>
                            
                            <div className="filter_col"  style={{width:"9%"}}><Input onPressEnter={value=>search(value) }    placeholder="logfc"  id="input_ssg_search_logFC"/></div>
                            
                            <div className="filter_col" style={{width:"19%"}}><Input onPressEnter={value=>search(value) }    placeholder="Avg.enrichment.Score"  id="input_ssg_search_Avg_Enrichment_Score"/></div>

                            <div className="filter_col" style={{width:"10%"}}><Input onPressEnter={value=>search(value) }   placeholder="t"  id="input_ssg_search_t"/></div>

                            <div className="filter_col" style={{width:"10%"}}><Input onPressEnter={value=>search(value) }   placeholder="p value"  id="input_ssg_search_p_value"/></div>

                             <div className="filter_col" style={{width:"10%"}}><Input onPressEnter={value=>search(value) }   placeholder="adj.P.val"  id="input_ssg_search_adj_p_value"/></div>
                 
                            <div className="filter_col"  style={{width:"10%"}}><Input onPressEnter={value=>search(value) }   placeholder="B"  id="input_ssg_search_b"/></div>

                    </div>
                            <Table 
                                columns={columns}
                                dataSource={this.props.data.ssGSEA.data}
                                pagination={this.props.data.ssGSEA.pagination}
                                loading={this.props.data.ssGSEA.loading}
                                onChange={this.handleTableChange}
                                />
                            </div>
                                </div>,
            <div id="ss_tag2" className="ss_plot hide" >
                                 <img src= {link}  style={{width:"100%"}} alt="Pathway Heatmap"/>
                                </div>
        ]
        content = [<Select defaultValue="ss_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option value="ss_tag1">Single Sample GSEA</Option>
                                  <Option value="ss_tag2">Pathway Heatmap</Option>
                                </Select>, tabs]


        return content;
    }
}

export default SSGSEATable;