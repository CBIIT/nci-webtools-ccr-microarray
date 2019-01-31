import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';
const Search = Input.Search;




class DEGTable extends Component {


    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
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


        this.props.getDEG({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            search_keyword: this.props.data.diff_expr_genes.search_keyword
        });
    }

   

    handleMenuClick = (e) => {
         document.getElementById("deg-drop-down").innerHTML=e.key
         this.props.getDEG({
            page_size: parseInt(e.key),
            page_number: 1,
            sorting: {
                name: this.props.data.diff_expr_genes.sorting.name,
                order: this.props.data.diff_expr_genes.sorting.order,
            },
            search_keyword: this.props.data.diff_expr_genes.search_keyword
        });
    }


    export = () => {
         this.props.exportDEG();
    }

    render() {
        let content = "";

        const columns = [{
                title: 'SYMBOL',
                dataIndex: 'SYMBOL',
                sorter: true,
                width: "9%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: 'FC',
                dataIndex: 'FC',
                sorter: true,
                width: "8%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: 'P VALUE',
                dataIndex: 'P.Value',
                sorter: true,
                width: "9%",
                defaultSortOrder: 'ascend',
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: 'adj.P.Val',
                dataIndex: 'adj.P.Val',
                sorter: true,
                width: "9%",

                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: 'AveExpr',
                dataIndex: 'AveExpr',
                sorter: true,
                width: "9%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: 'ACCNUM',
                dataIndex: 'ACCNUM',
                sorter: true,
                width: "10%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.10}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: 'DESC',
                dataIndex: 'DESC',
                sorter: true,
                width: "13%",
                render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.13}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            },
            {
                title: 'ENTREZ',
                dataIndex: 'ENTREZ',
                sorter: true,
                width: "9%",
                render: (text, record, index) => {
                    if(text!="" && text!="NA"){
                        let link ="https://www.ncbi.nlm.nih.gov/gene/"+text;
                         return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.9}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}> <a href={link} target="_blank">{text}</a></span>
                                    </div>
                        
                    }else{
                         return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.9}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>
                    }

                   

                }

            }, {
                title: 'probsetID',
                dataIndex: 'probsetID',
                sorter: true,
                width: "8%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.8}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: 't',
                dataIndex: 't',
                sorter: true,
                width: "9%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: 'B',
                dataIndex: 'B',
                sorter: true,
                width: "8%",
                 render: (text, record, index) => {

                    return <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

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
                page_size: 25,
                page_number: 1,
                sorting: {
                    name: "P.Value",
                    order: "ascend",
                },
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
                  <div> <p className="err-message" id="message-deg"></p></div>  
                 <div  className="div-export-deg"><Button   id="btn-deg-export"   type="primary" onClick={this.props.exportDEG}> Export</Button> </div>

                  <div id="deg-select">Display &nbsp;
                            <Dropdown overlay={menu}>
                                  <Button >
                                    <span id="deg-drop-down">25</span> <Icon type="down" />
                                  </Button>
                            </Dropdown>&nbsp;of total {this.props.data.diff_expr_genes.pagination.total}  records

                        </div>
                    <div>
                     <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>
                           <div className="filter_col"  style={{width:"10%"}}><label for="input_deg_search_symbol"><span style={{display:"none"}}>input_deg_search_symbol</span> <Input onPressEnter={value=>search(value) }  placeholder="SYMBOL"  id="input_deg_search_symbol"/></label></div>
                           <div className="filter_col"  style={{width:"7%"}} ><label for="input_deg_search_fc"><span style={{display:"none"}}>input_deg_search_fc</span> <Input onPressEnter={value=>search(value) }  placeholder="FC"  id="input_deg_search_fc"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_dge_search_p_value"><span style={{display:"none"}}>input_dge_search_p_value</span> <Input onPressEnter={value=>search(value) }    placeholder="0.05"  id="input_dge_search_p_value"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_deg_search_adj_p_value"><span style={{display:"none"}}>input_deg_search_adj_p_value</span> <Input onPressEnter={value=>search(value) }    placeholder="adj.p.val"  id="input_deg_search_adj_p_value"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}} ><label for="input_deg_search_aveexpr"><span style={{display:"none"}}>input_deg_search_aveexpr</span> <Input onPressEnter={value=>search(value) }   placeholder="AveExpr"  id="input_deg_search_aveexpr"/></label></div>
                           <div className="filter_col"  style={{width:"10%"}} ><label for="input_deg_search_accnum"><span style={{display:"none"}}>input_deg_search_accnum</span> <Input onPressEnter={value=>search(value) }   placeholder="ACCNUM"  id="input_deg_search_accnum"/></label></div>
                           <div className="filter_col"  style={{width:"16%"}}><label for="input_deg_search_desc"><span style={{display:"none"}}>input_deg_search_desc</span> <Input onPressEnter={value=>search(value) }  placeholder="Desc"  id="input_deg_search_desc"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}} ><label for="input_deg_search_entrez"><span style={{display:"none"}}>input_deg_search_entrez</span> <Input onPressEnter={value=>search(value) } placeholder="ENTREZ"  id="input_deg_search_entrez"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_deg_search_probsetid"><span style={{display:"none"}}>input_deg_search_probsetid</span> <Input onPressEnter={value=>search(value) }   placeholder="probsetID"  id="input_deg_search_probsetid"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_deg_search_t"><span style={{display:"none"}}>input_deg_search_t</span> <Input onPressEnter={value=>search(value) }  placeholder="t"  id="input_deg_search_t"/></label></div>
                           <div className="filter_col"  style={{width:"8%"}}><label for="input_deg_search_b"><span style={{display:"none"}}>input_deg_search_b</span> <Input onPressEnter={value=>search(value) }   placeholder="b"  id="input_deg_search_b"/></label></div>
                     </div>
            
                        <Table 
                            columns={columns}
                            dataSource={this.props.data.diff_expr_genes.data}
                            pagination={this.props.data.diff_expr_genes.pagination}
                            loading={this.props.data.diff_expr_genes.loading}
                            onChange={this.handleTableChange}
                            scroll={{ x: 960}}
                        />
                    </div>
                </div>



        return content;
    }
}

export default DEGTable;