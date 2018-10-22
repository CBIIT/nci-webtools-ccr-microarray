import React, { Component } from 'react';
import { Table, Select, Input, Tooltip } from 'antd';
import ReactSVG from 'react-svg'

const Search = Input.Search;
const Option = Select.Option;

class GSMData extends Component {



    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        term: "",
        boxplot: ""
    };

    constructor(props) {
        super(props);
    }


    onSelectChange = (selectedRowKeys) => {
        this.props.selected(selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    
    unselect = () => {
        this.setState({
            selectedRowKeys: [],
            loading: false,
        });
    }


    render() {

        const { loading, selectedRowKeys } = this.state;

        let content = <div>
            <p>Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here. </p>
       </div>;

        if (this.props.data.dataList.length > 0) {
            const columns = [{
                title: 'GSM',
                dataIndex: 'gsm',
                width: '18%',
                sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":"150px"}}>
                              <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                          </div>
                ),
            }, {
                title: 'TITLE',
                dataIndex: 'title',
                width: '30%',
                sorter: (a, b) => this.compareByAlph(a.title, b.title),
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":"300px"}}>
                          <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'DESCRIPTION',
                dataIndex: 'description',
                width: '30%',
                sorter: (a, b) => a.description.length - b.description.length,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":"300px"}}>
                          <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'GROUP',
                dataIndex: 'groups',
                width: '15%',
                sorter: (a, b) => this.compareByAlph(a.groups, b.groups),
            }];
            let count = 1;

            this.props.data.dataList.forEach(function(fl) {
                fl.key = count++;
            });


            const data = [...this.props.data.dataList];
            //this.state.data;

            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };



            const searchFilter = (row) => {
                if (this.state.term === "") {
                    return true;
                }

                if (row["gsm"].includes(this.state.term)) return true;
                if (row["title"].includes(this.state.term)) return true;
                if (row["description"].includes(this.state.term)) return true;

                return false;
            }

            content = <div>
                <div> <Search placeholder = "input search text"
            className = "input-search-gsm"
            onSearch = { value => this.setState({ term: value }) }
            /></div>
            <div> <Table rowSelection = { rowSelection } columns = { columns } dataSource = { data.filter(searchFilter, this) }
            /></div>
            </div>

        }

        return content;
    }
}

export default GSMData;