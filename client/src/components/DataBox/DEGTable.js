import React, { Component } from 'react';
import { Table, Input, Tooltip, message } from 'antd';
const Search = Input.Search;



class DEGTable extends Component {


    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    componentDidMount() {
        //this.props.getDEG();
    }


    handleTableChange = (pagination, filters, sorter) => {

        this.props.changeDeg({
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


        this.props.getDEG({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            foldDEGs: this.props.data.foldDEGs,
            P_Value: this.props.data.pDEGs,
            search_keyword: "",
        });
    }




    render() {
        let content = "";

        const columns = [{
                title: 'SYMBOL',
                dataIndex: 'SYMBOL',
                sorter: true,
                width:"9%",

            }, {
                title: 'FC',
                dataIndex: 'FC',
                sorter: true,
                  width:"7%",
               
            }, {
                title: 'P VALUE',
                dataIndex: 'P.Value',
                sorter: true,
                 width:"8%",
               
            },
            {
                title: 'adj.P.Val',
                dataIndex: 'adj.P.Val',
                sorter: true,
                 width:"8%",
               
            },
            {
                title: 'AveExpr',
                dataIndex: 'AveExpr',
                sorter: true,
                  width:"8%",
               
            }, {
                title: 'ACCNUM',
                dataIndex: 'ACCNUM',
                sorter: true,
                 width:"12%",
              
            },
            {
                title: 'DESC',
                dataIndex: 'DESC',
                sorter: true,
                width:"120px",
                render: (text, record, index) => {
                  
                        return <div className="single-line" style={{"maxWidth":"120px"}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            },
            {
                title: 'ENTREZ',
                dataIndex: 'ENTREZ',
                sorter: true,
                 width:"8%",
               
                onCellClick: function(record, event) {
                    //https://www.ncbi.nlm.nih.gov/gene/171281
                    if (record.ENTREZ !== "" && record.ENTREZ !== "NA") {
                        window.open("https://www.ncbi.nlm.nih.gov/gene/" + record.ENTREZ);
                    }

                }
            }, {
                title: 'probsetID',
                dataIndex: 'probsetID',
                sorter: true,
                width:"12%",
               
            }, {
                title: 't',
                dataIndex: 't',
                sorter: true,
                 width:"8%",
               
            },
            {
                title: 'B',
                dataIndex: 'B',
                sorter: true,
                 width:"8%",
              
            }

        ];


        const search = (e) => {

            var search_symbol = document.getElementById("input_deg_search_symbol").value;


            var search_fc = document.getElementById("input_deg_search_fc").value;


            var search_p_value = document.getElementById("input_dge_search_p_value").value;

            var search_adj_p_value = document.getElementById("input_deg_search_adj_p_value").value;


            var search_aveexpr = document.getElementById("input_deg_search_aveexpr").value;

            var search_accnum = document.getElementById("input_deg_search_accnum").value;

            var search_desc = document.getElementById("input_deg_search_desc").value;

            var search_entrez = document.getElementById("input_deg_search_entrez").value;

            var search_probsetid = document.getElementById("input_deg_search_probsetid").value;


            var search_t = document.getElementById("input_deg_search_t").value;

            var search_b = document.getElementById("input_deg_search_b").value;



            this.props.getDEG({
                search_keyword: {
                    "search_symbol": search_symbol,
                    "search_fc": search_fc,
                    "search_p_value": search_p_value,
                    "search_adj_p_value": search_adj_p_value,
                    "search_aveexpr": search_aveexpr,
                    "search_accnum": search_accnum,
                    "search_desc": search_desc,
                    "search_entrez": search_entrez,
                    "search_probsetid": search_probsetid,
                    "search_t": search_t,
                    "search_b": search_b
                }
            })
        }


        const searchFilter = (row) => {
            if (this.state.term === "") {
                return true;
            }

            if (row["DESC"].includes(this.state.term)) return true;

            return false;
        }

        content = <div>
                     <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>
                            <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"9%"}} placeholder="SYMBOL"  id="input_deg_search_symbol"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }  style={{width:"7%"}} placeholder="max"  id="input_deg_search_fc"/></div>
                           <div className="filter_col"  ><Input onPressEnter={value=>search(value) }   style={{width:"8%"}} placeholder="min"  id="input_dge_search_p_value"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }   style={{width:"8%"}} placeholder="max"  id="input_deg_search_adj_p_value"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }   style={{width:"8%"}} placeholder="max"  id="input_deg_search_aveexpr_max"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }   style={{width:"12%"}} placeholder="ACCNUM"  id="input_deg_search_accnum"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}} ><Input onPressEnter={value=>search(value) }  style={{width:"120px"}} placeholder="Desc"  id="input_deg_search_desc"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }  style={{width:"8%"}} placeholder="ENTREZ"  id="input_deg_search_entrez"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"12%"}} placeholder="ID"  id="input_deg_search_probsetid"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"8%"}} placeholder="min"  id="input_deg_search_t"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"8%"}} placeholder="max"  id="input_deg_search_b"/></div>
                     </div>
                    <div>
                        <Table 
                            columns={columns}
                            dataSource={this.props.data.diff_expr_genes.data}
                            pagination={this.props.data.diff_expr_genes.pagination}
                            loading={this.props.data.diff_expr_genes.loading}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>



        return content;
    }
}

export default DEGTable;