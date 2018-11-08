import React, { Component } from 'react';
import { Table, Input, message, Modal, Button, Tooltip } from 'antd';
const Search = Input.Search;


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


    componentDidMount() {
        //this.props.getPathwayDown();
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.changePathways_down({
            loading: true,
            data: [],
            pagination,
        })
        if (!sorter) {
            sorter = {
                field: "P_Value",
                rder: "descend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P_Value"
        }

        if (!sorter.order) {
            sorter.order = "descend"
        }


        this.props.getPathwayDown({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            pPathways: this.props.data.pPathways,
            search_keyword: "",
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
        reqBody.upOrDown = "downregulated_pathways";
        reqBody.pathway_name = row.Description;
        this.props.changeLoadingStatus(true, "loading heap Map")

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
                        var link = "./images/" + this.props.data.projectID + "/" + pic_link
                        this.setState({
                            heapMap: link,
                            visible: true
                        });
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
                title: 'PATHWAY_ID',
                dataIndex: 'Pathway_ID',
                width: "10%",
                key: 'Pathway_ID',
                sorter: true,

            },
            {
                title: 'SOURCE',
                dataIndex: 'Source',
                width: "8%",
                key: 'Source',
                sorter: true,
            },
            {
                title: 'DESCRIPTION',
                dataIndex: 'Description',
                width: "14%",
                key: 'Description',
                sorter: true,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":"100px"}}>
                        <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'TYPE',
                dataIndex: 'Type',
                width: "7%",
                key: 'Type',
                sorter: true,
            }, {
                title: 'P_VALUE',
                dataIndex: 'P_Value',
                width: "8%",
                key: 'P_Value',
                sorter: true,
            }, {
                title: 'FDR',
                dataIndex: 'FDR',
                width: "8%",
                key: 'FDR',
                sorter: true,
            }, {
                title: 'RATIO',
                dataIndex: 'Ratio',
                width: "8%",
                key: 'Ratio',
                sorter: true,
            }, {
                title: 'GENE_LIST',
                dataIndex: 'Gene_List',
                width: "12%",
                key: 'Gene_List',
                sorter: true,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":"100px"}}>
                         <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'NUMBER_HITS',
                dataIndex: 'Number_Hits',
                width: "85px",
                key: 'Number_Hits',
                sorter: true,
            }, {
                title: 'NUMBER_GENES_PATHWAY',
                dataIndex: 'Number_Genes_Pathway',
                width: "95px",
                key: 'Number_Genes_Pathway',
                sorter: true,

            }, {
                title: 'NUMBER_USER_GENES',
                dataIndex: 'Number_User_Genes',
                width: "85px",
                key: 'Number_User_Genes',
                sorter: true,
            }, {
                title: 'TOTAL_NUMBER_GENES',
                dataIndex: 'Total_Number_Genes',
                width: "90px",
                key: 'Total_Number_Genes',
                sorter: true,
            }
        ];

        // define group modal
        let modal = <Modal width={"75%"} visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Close</Button>
              ]}
            >
              <img src={this.state.heapMap} style={{width:"100%"}} alt="heapMap"/>
            </Modal>
        // end  group modal



        const search = (e) => {
            this.props.changePathways_up({
                loading: true,
                data: []
            })


            var search_PATHWAY_ID = document.getElementById("input_pathway_down_search_PATHWAY_ID").value;

            var search_SOURCE = document.getElementById("input_pathway_down_search_SOURCE").value;

            var search_DESCRIPTION = document.getElementById("input_pathway_down_search_DESCRIPTION").value;

            var search_TYPE = document.getElementById("input_pathway_down_search_TYPE").value;

            var search_p_value_min = document.getElementById("input_pathway_down_search_p_value_min").value;

            var search_p_value_max = document.getElementById("input_pathway_down_search_p_value_max").value;

            var search_fdr_min = document.getElementById("input_pathway_down_search_fdr_min").value;

            var search_fdr_max = document.getElementById("input_pathway_down_search_fdr_max").value;

            var search_RATIO_min = document.getElementById("input_pathway_down_search_RATIO_min").value;

            var search_RATIO_max = document.getElementById("input_pathway_down_search_RATIO_max").value;

            var search_GENE_LIST = document.getElementById("input_pathway_down_search_GENE_LIST").value;

            var search_NUMBER_HITS_min = document.getElementById("input_pathway_down_search_NUMBER_HITS_min").value;

            var search_NUMBER_HITS_max = document.getElementById("input_pathway_down_search_NUMBER_HITS_max").value;

            var search_NUMBER_GENES_PATHWAY_min = document.getElementById("input_pathway_down_search_NUMBER_GENES_PATHWAY_min").value;

            var search_NUMBER_GENES_PATHWAY_max = document.getElementById("input_pathway_down_search_NUMBER_GENES_PATHWAY_max").value;

            var search_NUMBER_USER_GENES_min = document.getElementById("input_pathway_down_search_NUMBER_USER_GENES_min").value;

            var search_NUMBER_USER_GENES_max = document.getElementById("input_pathway_down_search_NUMBER_USER_GENES_max").value;

            var search_TOTAL_NUMBER_GENES_min = document.getElementById("input_pathway_down_search_TOTAL_NUMBER_GENES_min").value;

            var search_TOTAL_NUMBER_GENES_max = document.getElementById("input_pathway_down_search_TOTAL_NUMBER_GENES_max").value;

            this.props.changePathways_down({
                loading: true,
                data: []
            })

            this.props.getPathwayDown({
                search_keyword: {
                    "search_PATHWAY_ID": search_PATHWAY_ID,
                    "search_SOURCE": search_SOURCE,
                    "search_DESCRIPTION": search_DESCRIPTION,
                    "search_TYPE": search_TYPE,
                    "search_p_value_min": search_p_value_min,
                    "search_p_value_max": search_p_value_max,
                    "search_fdr_min": search_fdr_min,
                    "search_fdr_max": search_fdr_max,
                    "search_RATIO_min": search_RATIO_min,
                    "search_RATIO_max": search_RATIO_max,
                    "search_GENE_LIST": search_GENE_LIST,
                    "search_NUMBER_HITS_min": search_NUMBER_HITS_min,
                    "search_NUMBER_HITS_max": search_NUMBER_HITS_max,
                    "search_NUMBER_GENES_PATHWAY_min": search_NUMBER_GENES_PATHWAY_min,
                    "search_NUMBER_GENES_PATHWAY_max": search_NUMBER_GENES_PATHWAY_max,
                    "search_NUMBER_USER_GENES_min": search_NUMBER_USER_GENES_min,
                    "search_NUMBER_USER_GENES_max": search_NUMBER_USER_GENES_max,
                    "search_TOTAL_NUMBER_GENES_min": search_TOTAL_NUMBER_GENES_min,
                    "search_TOTAL_NUMBER_GENES_ma": search_TOTAL_NUMBER_GENES_max,
                }
            })
        }


        content = <div>
                    <div><Search  placeholder="input search text" className="input-search-for-deg-path"  onSearch={value => this.search(value)} /></div>
                         <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>
                            <div className="filter_col" style={{width:"9%"}} ><Input onPressEnter={value=>search(value) }  placeholder="PATHWAY_ID"  id="input_pathway_down_search_PATHWAY_ID"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px","width":"7%"}}><Input onPressEnter={value=>search(value) }  placeholder="source"  id="input_pathway_down_search_SOURCE"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px",width:"13%"}}><Input onPressEnter={value=>search(value) }  placeholder="desc"  id="input_pathway_down_search_DESCRIPTION"/></div>
                           <div className="filter_col" style={{"paddingLeft": "5px",width:"6%"}} ><Input onPressEnter={value=>search(value) }    placeholder="type"  id="input_pathway_down_search_TYPE"/></div>
                           <div className="filter_col"  style={{width:"4%"}}><Input onPressEnter={value=>search(value) }    placeholder="min"  id="input_pathway_down_search_p_value_min"/></div>
                           <div className="filter_col"  style={{width:"4%"}}><Input onPressEnter={value=>search(value) }    placeholder="max"  id="input_pathway_down_search_p_value_max"/></div>
                           <div className="filter_col" style={{width:"4%"}}><Input onPressEnter={value=>search(value) }    placeholder="min"  id="input_pathway_down_search_fdr_min"/></div>
                           <div className="filter_col" style={{width:"4%"}}><Input onPressEnter={value=>search(value) }    placeholder="max"  id="input_pathway_down_search_fdr_max"/></div>

                            <div className="filter_col" style={{width:"4%"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_pathway_down_search_RATIO_min"/></div>
                           <div className="filter_col" style={{width:"4%"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_pathway_down_search_RATIO_max"/></div>


                           <div className="filter_col" style={{"paddingLeft": "5px",width:"11%"}}><Input onPressEnter={value=>search(value) }  placeholder="GENE_LIST"  id="input_pathway_down_search_GENE_LIST"/></div>

                            <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_pathway_down_search_NUMBER_HITS_min"/></div>
                           <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_pathway_down_search_NUMBER_HITS_max"/></div>
                 
                           <div className="filter_col"  style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_pathway_down_search_NUMBER_GENES_PATHWAY_min"/></div>
                           <div className="filter_col"  style={{width:"40px"}}><Input onPressEnter={value=>search(value) }  placeholder="max"  id="input_pathway_down_search_NUMBER_GENES_PATHWAY_max"/></div>


                           <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_pathway_down_search_NUMBER_USER_GENES_min"/></div>
                           <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_pathway_down_search_NUMBER_USER_GENES_max"/></div>

                           <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="min"  id="input_pathway_down_search_TOTAL_NUMBER_GENES_min"/></div>
                           <div className="filter_col" style={{width:"40px"}}><Input onPressEnter={value=>search(value) }   placeholder="max"  id="input_pathway_down_search_TOTAL_NUMBER_GENES_max"/></div>


                    </div>
                    <div>
                     <Table 
                        columns={columns}
                        dataSource={this.props.data.pathways_down.data}
                        pagination={this.props.data.pathways_down.pagination}
                        loading={this.props.data.pathways_down.loading}
                        onChange={this.handleTableChange}
                        onRowClick={this.showHeatMap}
                        />
                    {modal}
                    </div>
                </div>

        return content;
    }
}

export default PUGTable;