import React, { Component } from 'react';
import { Table, Select, message, Input } from 'antd';
const Search = Input.Search;
const Option = Select.Option;



class SSGSEATable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSelectionChange = this.handleSelectionChange.bind(this)

    }


    componentDidMount() {
        this.props.getssGSEA();
        this.props.upateCurrentWorkingTabAndObject("ssGSEA")
    }




    handleTableChange = (pagination, filters, sorter) => {
        this.props.changessGSEA({
            loading: true,
            data: [],
            pagination,
        })
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
            pPathways: this.props.data.pPathways,
            search_keyword: "",
            pssGSEA: this.props.data.pssGSEA,
            foldssGSEA: this.props.data.foldssGSEA,
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
            width: "11%"
        }, {
            title: 'Avg.Enrichment.Score',
            dataIndex: 'Avg.Enrichment.Score',
            sorter: true,
            width: "15%"
        }, {
            title: 't',
            dataIndex: 't',
            sorter: true,
            width: "11%"
        }, {
            title: 'P VALUE',
            dataIndex: 'P.Value',
            sorter: true,
            width: "11%"
        }, {
            title: 'adj.P.Val',
            dataIndex: 'adj.P.Val',
            sorter: true,
            width: "11%"
        }, {
            title: 'B',
            dataIndex: 'B',
            sorter: true,
            width: "11%"
        }, ];





        const search = (e) => {


            this.props.changessGSEA({
                loading: true,
                data: []
            })


            var search_name = document.getElementById("input_ssg_name").value;
            var search_logFC_min = document.getElementById("input_ssg_search_logFC_min").value;
            var search_logFC_max = document.getElementById("input_ssg_search_logFC_max").value;
            var search_Avg_Enrichment_Score_min = document.getElementById("input_ssg_search_Avg_Enrichment_Score_min").value;
            var search_Avg_Enrichment_Score_max = document.getElementById("input_ssg_search_Avg_Enrichment_Score_max").value;
            var search_t_min = document.getElementById("input_ssg_search_t_min").value;
            var search_t_max = document.getElementById("input_ssg_search_t_max").value;
            var search_p_value_min = document.getElementById("input_ssg_search_p_value_min").value;
            var search_p_value_max = document.getElementById("input_ssg_search_p_value_max").value;
            var search_adj_p_value_min = document.getElementById("input_ssg_search_adj_p_value_min").value;
            var search_adj_p_value_max = document.getElementById("input_ssg_search_adj_p_value_max").value;
            var search_b_min = document.getElementById("input_ssg_search_b_min").value;
            var search_b_max = document.getElementById("input_ssg_search_b_max").value;

            this.props.getssGSEA({
                search_keyword: {
                    "name": search_name,
                    "search_logFC_min": search_logFC_min,
                    "search_logFC_max": search_logFC_max,
                    "search_Avg_Enrichment_Score_min": search_Avg_Enrichment_Score_min,
                    "search_Avg_Enrichment_Score_max": search_Avg_Enrichment_Score_max,
                    "search_t_min": search_t_min,
                    "search_t_max": search_t_max,
                    "search_p_value_min": search_p_value_min,
                    "search_p_value_max": search_p_value_max,
                    "search_adj_p_value_min": search_adj_p_value_min,
                    "search_adj_p_value_max": search_adj_p_value_max,
                    "search_b_min": search_b_min,
                    "search_b_max": search_b_max,
                }
            })
        }


        var link = "./images/" + this.props.data.projectID + this.props.data.geneHeatmap

        let tabs = [<div id="ss_tag1" className="ss_plot">
                        <div><Search  placeholder="input search text" className="input-search-for-ssgsea"  onSearch={value => this.search(value)} /></div>
                         <div>
                          <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>

                            <div className="filter_col" style={{width:"30%"}} ><Input onPressEnter={value=>search(value) }  placeholder="PATHWAY_ID"  id="input_ssg_name"/></div>
                            <div className="filter_col"  style={{width:"5%"}}><Input onPressEnter={value=>search(value) }    placeholder="min"  id="input_ssg_search_logFC_min"/></div>
                            <div className="filter_col"  style={{width:"5%"}}><Input onPressEnter={value=>search(value) }    placeholder="max"  id="input_ssg_search_logFC_max"/></div>
                            <div className="filter_col" style={{width:"8%"}}><Input onPressEnter={value=>search(value) }    placeholder="min"  id="input_ssg_search_Avg_Enrichment_Score_min"/></div>
                            <div className="filter_col" style={{width:"8%"}}><Input onPressEnter={value=>search(value) }    placeholder="max"  id="input_ssg_search_Avg_Enrichment_Score_max"/></div>

                            <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_ssg_search_t_min"/></div>
                            <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_ssg_search_t_max"/></div>

                            <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_ssg_search_p_value_min"/></div>
                            <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_ssg_search_p_value_max"/></div>

                             <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_ssg_search_adj_p_value_min"/></div>
                            <div className="filter_col" style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_ssg_search_adj_p_value_max"/></div>
                 
                            <div className="filter_col"  style={{width:"5%"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_ssg_search_b_min"/></div>
                            <div className="filter_col"  style={{width:"5%"}}><Input onPressEnter={value=>search(value) }  placeholder="max"  id="input_ssg_search_b_max"/></div>

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