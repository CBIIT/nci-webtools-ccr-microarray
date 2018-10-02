import React, { Component } from 'react';
import { Table, Select, Input } from 'antd';
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


    handleSearch = (val) => {
        if (val == "") {
            // clear search 
            this.setState({
                data: Object.assign({}, this.props.data.dataList)
            })
        } else {
            let data = Object.assign({}, this.props.data.dataList);
            const result = data.filter(d => d["gsm"].indexOf(val) > 0 || d["title"].indexOf(val) > 0 || d["description"].indexOf(val) > 0);
            this.setState({
                data: result
            })
        }


    }



    render() {

        const { loading, selectedRowKeys } = this.state;

        let content = <div>
            <p>Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here. </p>
       </div>;

        if (this.props.data.dataList.length > 0) {
            const columns = [{
                title: 'gsm',
                dataIndex: 'gsm',
                width: '15%',

                sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
            }, {
                title: 'title',
                dataIndex: 'title',
                width: '30%',

                sorter: (a, b) => this.compareByAlph(a.title, b.title),
            }, {
                title: 'description',
                dataIndex: 'description',
                width: '30%',

                sorter: (a, b) => a.description.length - b.description.length,
            }, {
                title: 'group',
                dataIndex: 'groups',
                width: '20%',

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