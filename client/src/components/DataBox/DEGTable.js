import React, { Component } from 'react';
import { Table, Input, Tooltip ,message} from 'antd';
const Search = Input.Search;

const columns = [{
    title: 'SYMBOL',
    dataIndex: 'SYMBOL',
    sorter: true,
}, {
    title: 'FC',
    dataIndex: 'FC',
    sorter: true,
}, {
    title: 'P.value',
    dataIndex: 'P.Value',
    sorter: true,
}, {
    title: 'adj.P.Val',
    dataIndex: 'adj.P.Val',
    sorter: true,
}, {
    title: 'AveExpr',
    dataIndex: 'AveExpr',
    sorter: true,
}, {
    title: 'ACCNUM',
    dataIndex: 'ACCNUM',
    sorter: true,
}, {
    title: 'DESC',
    dataIndex: 'DESC',
    width: '150px',
    sorter: true,
    render: (text, record, index) => (
        <div className="single-line" style={{"maxWidth":"100px"}}>
            <Tooltip title={text} placement="topLeft" >
              <span>{text}</span>
            </Tooltip>
          </div>
    ),
}, {
    title: 'ENTREZ',
    dataIndex: 'ENTREZ',
    sorter: true,
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
}, {
    title: 't',
    dataIndex: 't',
    sorter: true,
}, {
    title: 'B',
    dataIndex: 'B',
    sorter: true,
}];



class DEGTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            term: "",
            page_number: 1,
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,

            },
            loading: false,
        }

        this.handleTableChange = this.handleTableChange.bind(this)
        this.fetch = this.fetch.bind(this)
    }

     componentDidMount() {
            this.fetch();
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        if(!sorter){
            sorter={
                field : "P.Value",
                rder : "descend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P.Value"
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
            foldDEGs:this.props.data.foldDEGs,
            P_Value: this.props.data.pDEGs,
            search_keyword: "",
        });
    }

    fetch = (params = {}) => {
        if(!params.foldDEGs){
            params ={
            page_size: 10,
            page_number: 1,
            sorting: {
                name: "P.Value",
                order: "descend",
            },
            foldDEGs:this.props.data.foldDEGs,
            P_Value: this.props.data.pDEGs,
            search_keyword: "",
        }
        }
        
        console.log('params:', params);
        this.setState({ loading: true });
        fetch('./api/analysis/getDEG', {
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
                    const pagination = { ...this.state.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "DEG" + i;
                    }

                    this.setState({
                        loading: false,
                        data: result.data.records,
                        pagination,
                    });
                } else {
                    message.warning('no data');
                }

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
                    <div><Search  placeholder="input search text"  className="input-search-for-deg-path"  onSearch={value => this.setState({term: value})} /></div>
                    <div>
                        <Table 
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={this.state.pagination}
                            loading={this.state.loading}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>



        return content;
    }
}

export default DEGTable;