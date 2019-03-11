import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';
const Search = Input.Search;

const minWidth = 110;
const exponentialNum = 2;

class DEGTable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.sorter = this.sorter.bind(this);
    }

    

  
    handleTableChange = (pagination, filters, sorter) => {


        this.props.getDEG({
            page_size: pagination.pageSize,
            page_number: pagination.current,

            sorting: this.props.data.diff_expr_genes.sorting,
            search_keyword: this.props.data.diff_expr_genes.search_keyword
        });
    }
       


    sorter = (field, order) => {
      
        if (!field) {
            field = "P.Value"
        }

        if (!order) {
            order = "ascend"
        }


        this.props.getDEG({
            page_size: this.props.data.diff_expr_genes.pagination.pageSize,
            page_number: this.props.data.diff_expr_genes.pagination.current,
            sorting: {
                name: field,
                order: order,
            },
            search_keyword: this.props.data.diff_expr_genes.search_keyword
        });
    }


    render() {
        let content = "";



          const columns = [{

                title: (
                    <div style={{ textAlign: 'center' }}>
                    <label htmlFor="input_deg_search_symbol"><span style={{display:"none"}}>input_deg_search_symbol</span>
                     <Input  aria-label="input_deg_search_symbol" onPressEnter={value=>search(value) }  placeholder="SYMBOL"  id="input_deg_search_symbol"/></label>
                           <div>   
                        <div  className="head-title"> SYMBOL </div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="SYMBOL"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("SYMBOL","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="SYMBOL"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("SYMBOL","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                    </div>
                </div>
                ),
                dataIndex: 'SYMBOL',
                sorter: true,
                width: "8%",
                render: (text, record, index) => {

                    return <div  className="single-line deg_SYMBOL" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.10:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: (
                    <div style={{ textAlign: 'center' }}>
                      <label htmlFor="input_deg_search_fc"><span style={{display:"none"}}>input_deg_search_fc</span>
                      <Input  aria-label="input_deg_search_fc"  onPressEnter={value=>search(value) }  placeholder="FC"  id="input_deg_search_fc"/></label>
                    <div>   
                        <div  className="head-title"> FC </div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="FC"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("FC","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="FC"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("FC","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                    </div>
                </div>
                ),
                dataIndex: 'FC',
                sorter: true,
                width: "6%",
                render: (text, record, index) => {

                    return <div  className="deg_fc single-line"  style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.06>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.07:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="right" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: (
                    <div style={{ textAlign: 'center' }}>
                          <label htmlFor="input_dge_search_p_value"><span style={{display:"none"}}>input_dge_search_p_value</span> 
                          <Input  aria-label="input_dge_search_p_value"  onPressEnter={value=>search(value) }    placeholder="0.05"  id="input_dge_search_p_value"/></label>
                           <div>   
                            <div  className="head-title"> P.Value</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="P.Value"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("P.Value","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="P.Value"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("P.Value","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'P.Value',
                sorter: true,
                width: "8%",
                defaultSortOrder: 'ascend',
                render: (text, record, index) => {

                    return <div className="p_value single-line"  style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.10:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{Number.parseFloat(text).toExponential(exponentialNum)}</span>
                                    </div>

                }

            },
            {
                title: (
                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="input_deg_search_adj_p_value"><span style={{display:"none"}}>input_deg_search_adj_p_value</span>
                        <Input  aria-label="input_deg_search_adj_p_value" onPressEnter={value=>search(value) }    placeholder="adj.p.val"  id="input_deg_search_adj_p_value"/></label>
                          <div>   
                            <div  className="head-title"> adj.P.Val</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="adj.P.Val"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("adj.P.Val","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="adj.P.Val"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("adj.P.Val","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'adj.P.Val',
                sorter: true,
                width: "8%",

                render: (text, record, index) => {

                    return <div  className="adj_p_value single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.10:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{Number.parseFloat(text).toExponential(exponentialNum)}</span>
                                    </div>

                }

            },
            {
                title: (
                    <div style={{ textAlign: 'center' }}>
                         <label htmlFor="input_deg_search_aveexpr"><span style={{display:"none"}}>input_deg_search_aveexpr</span>
                         <Input aria-label="input_deg_search_aveexpr" onPressEnter={value=>search(value) }   placeholder="AveExpr"  id="input_deg_search_aveexpr"/></label>
                         <div>   
                            <div  className="head-title"> AveExpr</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="AveExpr"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("AveExpr","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="AveExpr"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("AveExpr","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'AveExpr',
                sorter: true,
                width: "8%",
                render: (text, record, index) => {

                    return <div  className="aveexpr single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: (
                    <div style={{ textAlign: 'center' }}>
                             <label htmlFor="input_deg_search_input_deg_search_accnum"><span style={{display:"none"}}>input_deg_search_accnum</span>
                             <Input aria-label="input_deg_search_accnum" onPressEnter={value=>search(value) }   placeholder="ACCNUM"  id="input_deg_search_accnum"/></label>
                          <div>   
                            <div  className="head-title"> ACCNUM</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="ACCNUM"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("ACCNUM","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="ACCNUM"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("ACCNUM","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'ACCNUM',
                sorter: true,
                width: "9%",
                render: (text, record, index) => {

                    return <div  className="accnum single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.09>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.12:minWidth+50}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: (
                    <div style={{ textAlign: 'center' }}>
                            <label htmlFor="input_deg_search_desc"><span style={{display:"none"}}>input_deg_search_desc</span>
                            <Input aria-label="input_deg_search_desc" onPressEnter={value=>search(value) }  placeholder="Desc"  id="input_deg_search_desc"/></label>
                         <div>   
                            <div  className="head-title"> DESC</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="DESC"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("DESC","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="DESC"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("DESC","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'DESC',
                sorter: true,
                width: "15%",
                render: (text, record, index) => {

                    return <div  className="deg_desc single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.15>150?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.15:150}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }
            },
            {
                title: (
                    <div style={{ textAlign: 'center' }}>
                     <label htmlFor="input_deg_search_entrez"><span style={{display:"none"}}>input_deg_search_entrez</span>
                     <Input  aria-label="input_deg_search_entrez" onPressEnter={value=>search(value) } placeholder="ENTREZ"  id="input_deg_search_entrez"/></label>
                        <div>   
                            <div  className="head-title"> ENTREZ</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="ENTREZ"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("ENTREZ","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="ENTREZ"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("ENTREZ","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'ENTREZ',
                sorter: true,
                width: "10%",
                render: (text, record, index) => {
                    if (text != "" && text != "NA") {
                        let link = "https://www.ncbi.nlm.nih.gov/gene/" + text;
                        return <div  className="deg_entrez single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.11:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}> <a href={link} target="_blank">{text}</a></span>
                                    </div>

                    } else {
                        return <div  className="deg_entrez single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.1>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.11:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>
                    }



                }

            }, {
                title: (
                    <div style={{ textAlign: 'center' }}>
                       <label htmlFor="input_deg_search_probsetid"><span style={{display:"none"}}>input_deg_search_probsetid</span>
                       <Input aria-label="input_deg_search_probsetid" onPressEnter={value=>search(value) }   placeholder="probsetID"  id="input_deg_search_probsetid"/></label>
                         <div>   
                            <div  className="head-title"> probsetID</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="probsetID"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("probsetID","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="probsetID"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("probsetID","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'probsetID',
                sorter: true,
                width: "8%",
                render: (text, record, index) => {

                    return <div  className="deg_probsetid single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.08:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            }, {
                title: (
                    <div style={{ textAlign: 'center' }}>
                      <label htmlFor="input_deg_search_t"><span style={{display:"none"}}>input_deg_search_t</span>
                      <Input aria-label="input_deg_search_t" onPressEnter={value=>search(value) }  placeholder="t"  id="input_deg_search_t"/></label>
                       <div>   
                            <div  className="head-title"> t</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="t"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("t","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="t"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("t","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 't',
                sorter: true,
                width: "5%",
                render: (text, record, index) => {

                    return <div className="deg_t  single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.05>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.05:minWidth}}>
                                    <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                                    </div>

                }

            },
            {
                title: (
                    <div style={{ textAlign: 'center' }}>
                       <label htmlFor="input_deg_search_b"><span style={{display:"none"}}>input_deg_search_b</span>
                       <Input aria-label="input_deg_search_b"  onPressEnter={value=>search(value) }   placeholder="b"  id="input_deg_search_b"/></label>
                          <div>   
                            <div  className="head-title"> b</div>
                            <div className="head-sorter">
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="b"&&this.props.data.diff_expr_genes.sorting.order=="ascend"?"blue":"#ccc"}}   onClick={()=>this.sorter("b","ascend")}><i className="fas fa-angle-up"></i></a>
                                </div>
                                <div>
                                    <a style={{"color": this.props.data.diff_expr_genes.sorting.name=="b"&&this.props.data.diff_expr_genes.sorting.order=="descend"?"blue":"#ccc"}} onClick={()=>this.sorter("b","descend")}><i className="fas fa-angle-down"></i></a>
                                </div>
                                
                            </div>
                        </div>
                </div>
                ),
                dataIndex: 'B',
                sorter: true,
                width: "5%",
                render: (text, record, index) => {

                    return <div  className="deg_b single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.05>minWidth?document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.05:minWidth}}>
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
                    <Table 
                            columns={columns}
                            dataSource={this.props.data.diff_expr_genes.data}
                            pagination={this.props.data.diff_expr_genes.pagination}
                            loading={this.props.data.diff_expr_genes.loading}
                            onChange={this.handleTableChange}
                            scroll={{ x: 600}}
                        />
                    </div>
                </div>



        return content;
    }
}

export default DEGTable;