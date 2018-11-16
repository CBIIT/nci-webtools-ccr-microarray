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
        let obj = { ...this.props.data.pathways_down.search_keyword }
        document.getElementById("input_pathway_down_search_PATHWAY_ID").value = obj.search_PATHWAY_ID;
        document.getElementById("input_pathway_down_search_SOURCE").value = obj.search_SOURCE;
        document.getElementById("input_pathway_down_search_DESCRIPTION").value = obj.search_DESCRIPTION;
        document.getElementById("input_pathway_down_search_TYPE").value = obj.search_TYPE;
        document.getElementById("input_pathway_down_search_p_value").value = obj.search_p_value;
        document.getElementById("input_pathway_down_search_fdr").value = obj.search_fdr;
        document.getElementById("input_pathway_down_search_RATIO").value = obj.search_RATIO;
        document.getElementById("input_pathway_down_search_GENE_LIST").value = obj.search_GENE_LIST;
        document.getElementById("input_pathway_down_search_NUMBER_HITS").value = obj.search_NUMBER_HITS;
        document.getElementById("input_pathway_down_search_NUMBER_GENES_PATHWAY").value = obj.search_NUMBER_GENES_PATHWAY;
        document.getElementById("input_pathway_down_search_NUMBER_USER_GENES").value = obj.search_NUMBER_USER_GENES;
        document.getElementById("input_pathway_down_search_TOTAL_NUMBER_GENES").value = obj.search_TOTAL_NUMBER_GENES;
    }

    handleTableChange = (pagination, filters, sorter) => {

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
            search_keyword: this.props.data.pathways_down.search_keyword,
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
                width: "9%",
                key: 'Source',
                sorter: true,
            },
            {
                title: 'DESCRIPTION',
                dataIndex: 'Description',
                width: "10%",
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
                width: "10%",
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
                width: "7%",
                key: 'FDR',
                sorter: true,
            }, {
                title: 'RATIO',
                dataIndex: 'Ratio',
                width: "7%",
                key: 'Ratio',
                sorter: true,
            }, {
                title: 'GENE_LIST',
                dataIndex: 'Gene_List',
                width: "10%",
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
                width: "7%",
                key: 'Number_Hits',
                sorter: true,
            }, {
                title: 'NUMBER_GENES_PATHWAY',
                dataIndex: 'Number_Genes_Pathway',
                width: "7%",
                key: 'Number_Genes_Pathway',
                sorter: true,

            }, {
                title: 'NUMBER_USER_GENES',
                dataIndex: 'Number_User_Genes',
                width: "7%",
                key: 'Number_User_Genes',
                sorter: true,
            }, {
                title: 'TOTAL_NUMBER_GENES',
                dataIndex: 'Total_Number_Genes',
                width: "8%",
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
                page_size: 20,
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


        content = <div>
                         <div className="row" style={{"paddingLeft": "10px","paddingTop": "5px"}}>
                           <div className="filter_col" style={{width:"10%"}} ><Input onPressEnter={value=>search(value) }  placeholder="PATHWAY_ID"  id="input_pathway_down_search_PATHWAY_ID"/></div>
                           <div className="filter_col" style={{width:"9%"}}><Input onPressEnter={value=>search(value) }  placeholder="source"  id="input_pathway_down_search_SOURCE"/></div>
                           <div className="filter_col" style={{width:"9%"}}><Input onPressEnter={value=>search(value) }  placeholder="desc"  id="input_pathway_down_search_DESCRIPTION"/></div>
                           <div className="filter_col" style={{width:"9%"}} ><Input onPressEnter={value=>search(value) }    placeholder="type"  id="input_pathway_down_search_TYPE"/></div>
                           <div className="filter_col"  style={{width:"8%"}}><Input onPressEnter={value=>search(value) }    placeholder="P_Value"  id="input_pathway_down_search_p_value"/></div>
                           <div className="filter_col" style={{width:"7%"}}><Input onPressEnter={value=>search(value) }    placeholder="FDR"  id="input_pathway_down_search_fdr"/></div>
                           <div className="filter_col" style={{width:"7%"}}><Input onPressEnter={value=>search(value) }   placeholder="Ratio"  id="input_pathway_down_search_RATIO"/></div>
                           <div className="filter_col" style={{width:"9%"}}><Input onPressEnter={value=>search(value) }  placeholder="GENE_LIST"  id="input_pathway_down_search_GENE_LIST"/></div>
                           <div className="filter_col" style={{width:"7%"}}><Input onPressEnter={value=>search(value) }   placeholder="HITS"  id="input_pathway_down_search_NUMBER_HITS"/></div>
                           <div className="filter_col"  style={{width:"7%"}}><Input onPressEnter={value=>search(value) }   placeholder="GENES_PATHWAY"  id="input_pathway_down_search_NUMBER_GENES_PATHWAY"/></div>
                           <div className="filter_col" style={{width:"7%"}}><Input onPressEnter={value=>search(value) }   placeholder="USER_GENES"  id="input_pathway_down_search_NUMBER_USER_GENES"/></div>
                           <div className="filter_col" style={{width:"8%"}}><Input onPressEnter={value=>search(value) }   placeholder="GENES"  id="input_pathway_down_search_TOTAL_NUMBER_GENES"/></div>
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