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
                width:90,

            }, {
                title: 'FC',
                dataIndex: 'FC',
                sorter: true,
                  width:80,
               
            }, {
                title: 'P VALUE',
                dataIndex: 'P.Value',
                sorter: true,
                    width:120,
               
            },
            {
                title: 'adj.P.Val',
                dataIndex: 'adj.P.Val',
                sorter: true,
                  width:90,
               
            },
            {
                title: 'AveExpr',
                dataIndex: 'AveExpr',
                sorter: true,
                 width:90,
               
            }, {
                title: 'ACCNUM',
                dataIndex: 'ACCNUM',
                sorter: true,
                 width:120,
              
            },
            {
                title: 'DESC',
                dataIndex: 'DESC',
                width: '150px',
                sorter: true,
                render: (text, record, index) => {
                  
                        return <div className="single-line" style={{"maxWidth":"100px"}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            },
            {
                title: 'ENTREZ',
                dataIndex: 'ENTREZ',
                sorter: true,
                 width:90,
               
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
                 width:110,
               
            }, {
                title: 't',
                dataIndex: 't',
                sorter: true,
                 width:80,
               
            },
            {
                title: 'B',
                dataIndex: 'B',
                sorter: true,
                 width:80,
              
            }

        ];


        const search = (e) => {

            var search_symbol = document.getElementById("input_deg_search_symbol").value;

            var search_fc_min = document.getElementById("input_deg_search_fc_min").value;

            var search_fc_max = document.getElementById("input_deg_search_fc_max").value;

            var search_p_value_min = document.getElementById("input_dge_search_p_value_min").value;

            var search_adj_p_value_min = document.getElementById("input_deg_search_adj_p_value_min").value;

            var search_p_value_max = document.getElementById("input_dge_search_p_value_max").value;

            var search_adj_p_value_max = document.getElementById("input_deg_search_adj_p_value_max").value;

            var search_aveexpr_min = document.getElementById("input_deg_search_aveexpr_min").value;

            var search_aveexpr_max = document.getElementById("input_deg_search_aveexpr_max").value;

            var search_accnum = document.getElementById("input_deg_search_accnum").value;

            var search_desc = document.getElementById("input_deg_search_desc").value;

            var search_entrez = document.getElementById("input_deg_search_entrez").value;

            var search_probsetid = document.getElementById("input_deg_search_probsetid").value;

            var search_t_min = document.getElementById("input_deg_search_t_min").value;

            var search_b_min = document.getElementById("input_deg_search_b_min").value;


            var search_t_max = document.getElementById("input_deg_search_t_max").value;

            var search_b_max = document.getElementById("input_deg_search_b_max").value;



            this.props.getDEG({
                search_keyword: {
                    "search_symbol": search_symbol,
                    "search_fc_min": search_fc_min,
                    "search_fc_max": search_fc_max,
                    "search_p_value_min": search_p_value_min,
                    "search_p_value_max": search_p_value_max,
                    "search_adj_p_value_min": search_adj_p_value_min,
                    "search_adj_p_value_max": search_adj_p_value_max,
                    "search_aveexpr_min": search_aveexpr_min,
                    "search_aveexpr_max": search_aveexpr_max,
                    "search_accnum": search_accnum,
                    "search_desc": search_desc,
                    "search_entrez": search_entrez,
                    "search_probsetid": search_probsetid,
                    "search_t_min": search_t_min,
                    "search_b_min": search_b_min,
                    "search_t_max": search_t_max,
                    "search_b_max": search_b_max
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
                            <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"80px"}} placeholder="SYMBOL"  id="input_deg_search_symbol"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="min"  id="input_deg_search_fc_min"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="max"  id="input_deg_search_fc_max"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="min"  id="input_dge_search_p_value_min"/></div>
                           <div className="filter_col"  ><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="max"  id="input_deg_search_adj_p_value_min"/></div>
                           <div className="filter_col"  ><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="min"  id="input_dge_search_p_value_max"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="max"  id="input_deg_search_adj_p_value_max"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="min"  id="input_deg_search_aveexpr_min"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }   style={{width:"40px"}} placeholder="max"  id="input_deg_search_aveexpr_max"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }   style={{width:"110px"}} placeholder="ACCNUM"  id="input_deg_search_accnum"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}} ><Input onPressEnter={value=>search(value) }  style={{width:"145px"}} placeholder="Desc"  id="input_deg_search_desc"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px"}}><Input onPressEnter={value=>search(value) }  style={{width:"80px"}} placeholder="ENTREZ"  id="input_deg_search_entrez"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"100px"}} placeholder="ID"  id="input_deg_search_probsetid"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="min"  id="input_deg_search_t_min"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="max"  id="input_deg_search_b_min"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="min"  id="input_deg_search_t_max"/></div>
                           <div className="filter_col"><Input onPressEnter={value=>search(value) }  style={{width:"40px"}} placeholder="max"  id="input_deg_search_b_max"/></div>
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