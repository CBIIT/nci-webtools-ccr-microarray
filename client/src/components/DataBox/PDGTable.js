import React, { Component } from 'react';
import { Table, Input, message, Modal, Button, Tooltip } from 'antd';
const Search = Input.Search;
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
    },  {
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

    search=(value)=>{
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
         this.props.changeLoadingStatus(true,"loading heap Map")

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
                this.props.changeLoadingStatus(false,"")
                if (result.status == 200) {
                    if (Object.keys(result.data).length === 0 && result.data.constructor === Object) {

                        message.success('no rows to aggregate');

                    } else {

                        var link = "./images/" + this.props.data.projectID + "/" + result.data
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

        // define group modal
        let modal = <Modal width={"75%"} visible={visible}  onOk={this.handleOk} onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Close</Button>
              ]}
            >
              <img src={this.state.heapMap} style={{width:"100%"}} alt="heapMap"/>
            </Modal>
        // end  group modal

        content = <div>
                    <div><Search  placeholder="input search text" className="input-search-for-deg-path"  onSearch={value => this.search(value)} /></div>
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