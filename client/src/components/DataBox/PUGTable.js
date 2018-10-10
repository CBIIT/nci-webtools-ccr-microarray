import React, { Component } from 'react';
import { Table, Input, message, Modal, Button, Tooltip } from 'antd';
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
const Search = Input.Search;


const columns = [{
    title: 'Pathway_ID',
    dataIndex: 'Pathway_ID',
    width: "10%",
    sorter: true,
}, {
    title: 'Source',
    dataIndex: 'Source',
    width: "8%",
    sorter: true,
}, {
    title: 'Description',
    dataIndex: 'Description',
    width: "14%",
    sorter: true,
    render: (text, record, index) => (
        <div className="single-line" style={{"maxWidth":"100px"}}>
                        <Tooltip title={text} placement="top" >
                          <span>{text}</span>
                        </Tooltip>
                      </div>
    ),
}, {
    title: 'Type',
    dataIndex: 'Type',
    width: "7%",
    sorter: true,
}, {
    title: 'P_Value',
    dataIndex: 'P_Value',
    width: "8%",
    sorter: true,
}, {
    title: 'FDR',
    dataIndex: 'FDR',
    width: "8%",
    sorter: true,
}, {
    title: 'Ratio',
    dataIndex: 'Ratio',
    width: "8%",
    sorter: true,
}, {
    title: 'Gene_List',
    dataIndex: 'Gene_List',
    width: "12%",
    sorter: true,
    render: (text, record, index) => (
        <div className="single-line" style={{"maxWidth":"100px"}}>
                        <Tooltip title={text} placement="top" >
                          <span>{text}</span>
                        </Tooltip>
                      </div>
    ),
}, {
    title: 'Number_Hits',
    dataIndex: 'Number_Hits',
    width: "85px",
    sorter: true,
}, {
    title: 'Number_Genes_Pathway',
    dataIndex: 'Number_Genes_Pathway',
    width: "95px",
    sorter: true,

}, {
    title: 'Number_User_Genes',
    dataIndex: 'Number_User_Genes',
    width: "85px",
    sorter: true,
}, {
    title: 'Total_Number_Genes',
    dataIndex: 'Total_Number_Genes',
    width: "90px",
    sorter: true,
}];


class PUGTable extends Component {

    // term: search keywords
    constructor(props) {
        super(props);

        this.state = {
            term: "",
            heapMap: "",
            visible: false,
            table_content: ""
        }

        this.handleTableChange = this.handleTableChange.bind(this)
        this.fetch = this.fetch.bind(this)

    }

    componentDidMount() {
        this.fetch();
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.changePathways_up({
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


        this.fetch({
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

    fetch = (params = {}) => {
        if (!params.pPathways) {
            params = {
                page_size: 10,
                page_number: 1,
                sorting: {
                    name: "P_Value",
                    order: "descend",
                },
                pPathways: this.props.data.pPathways,
                search_keyword: "",
            }
        }

        console.log('params:', params);
        this.setState({ loading: true });
        fetch('./api/analysis/getUpPathWays', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    const pagination = { ...this.props.data.pathways_up.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_up" + i;
                    }



                    this.props.changePathways_up({
                        loading: false,
                        data: result.data.records,
                        pagination,
                    })

                } else {
                    message.warning('no data');
                }

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


    showHeapMap(row, idx, event) {
        // not reflected in interface 
        let reqBody = {};
        reqBody.projectId = this.props.data.projectID;
        reqBody.group1 = this.props.data.group_1;
        reqBody.group2 = this.props.data.group_2;
        reqBody.upOrDown = "upregulated_pathways";
        reqBody.pathway_name = row.Description;

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

                if (result.status == 200) {
                    if (Object.keys(result.data).length === 0 && result.data.constructor === Object) {

                        message.success('no rows to aggregate');

                    } else {
                        let pic_link = JSON.parse(result.data).
                        pic_name
                        var link = "./images/" + this.props.data.projectID + "/" + pic_link
                        this.setState({
                            heapMap: link,
                            visible: true
                        });
                    }

                } else {
                    message.warning('no rows to aggregate');
                }

            })
    }




    render() {

        const { visible } = this.state;
        let content = "";

        // define group modal
        let modal = <Modal width={"75%"} visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Close</Button>,
              ]}
            >
              <img src={this.state.heapMap} style={{width:"100%"}} alt="heapMap"/>
            </Modal>
        // end  group modal

        content = <div>
                    <div><Search  placeholder="input search text" className="input-search-for-deg-path" onSearch={value => this.setState({term: value})} /></div>
                    <div>
                     <Table 
                        columns={columns}
                        dataSource={this.props.data.pathways_up.data}
                        pagination={this.props.data.pathways_up.pagination}
                        loading={this.props.data.pathways_up.loading}
                        onChange={this.handleTableChange}
                        />
                    {modal}
                    </div>
                </div>

        return content;
    }
}

export default PUGTable;