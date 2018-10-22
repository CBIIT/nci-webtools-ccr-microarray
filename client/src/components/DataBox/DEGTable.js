import React, { Component } from 'react';
import { Table, Input, Tooltip, message } from 'antd';
const Search = Input.Search;

const columns = [{
        title: 'SYMBOL',
        dataIndex: 'SYMBOL',
        sorter: true,
    },
    {
        title: 'FC',
        dataIndex: 'FC',
        sorter: true,
    },
    {
        title: 'P VALUE',
        dataIndex: 'P.Value',
        sorter: true,
    },
    {
        title: 'adj.P.Val',
        dataIndex: 'adj.P.Val',
        sorter: true,
    },
    {
        title: 'AveExpr',
        dataIndex: 'AveExpr',
        sorter: true,
    },
    {
        title: 'ACCNUM',
        dataIndex: 'ACCNUM',
        sorter: true,
    },
    {
        title: 'DESC',
        dataIndex: 'DESC',
        width: '150px',
        sorter: true,
        render: (text, record, index) => (
            <div className="single-line" style={{"maxWidth":"100px"}}>
             <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
          </div>
        ),
    },
    {
        title: 'ENTREZ',
        dataIndex: 'ENTREZ',
        sorter: true,
        onCellClick: function(record, event) {
            //https://www.ncbi.nlm.nih.gov/gene/171281
            if (record.ENTREZ !== "" && record.ENTREZ !== "NA") {
                window.open("https://www.ncbi.nlm.nih.gov/gene/" + record.ENTREZ);
            }

        }
    },
    {
        title: 'probsetID',
        dataIndex: 'probsetID',
        sorter: true,
    }, {
        title: 't',
        dataIndex: 't',
        sorter: true,
    }, {
        title: 'B',
        dataIndex: 'B',
        sorter: true,
    }
];



class DEGTable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this)
    }

    componentDidMount() {
        //this.props.getDEG();
    }

    search = (value) => {
        this.props.changeDeg({
            loading: true,
            data: []
        })

        this.props.getDEG({
            search_keyword: value
        });
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

        const searchFilter = (row) => {
            if (this.state.term === "") {
                return true;
            }

            if (row["DESC"].includes(this.state.term)) return true;

            return false;
        }

        content = <div>
                    <div><Search  placeholder="input search text"  className="input-search-for-deg-path"  onSearch={value => this.search(value)} /></div>
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