import React, { Component } from 'react';
import { Table, Select, Input, Tooltip } from 'antd';
import ReactSVG from 'react-svg'

const Search = Input.Search;
const Option = Select.Option;
const Selections = []

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

    handleSelectAll = () => {
        console.log("handle select all ")
    }
    handleSelection = (key) => {
        console.log(key)
        let selectedRowKeys = this.getCheckedBoxes("select-GSM")


    }

    // Pass the checkbox name to the function
    getCheckedBoxes(chkboxName) {
        var checkboxes = document.getElementsByClassName(chkboxName);
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            let key =parseInt(checkboxes[i].parentElement.parentElement.parentElement.getAttribute("data-row-key"));
            if (checkboxes[i].checked) {

                if (!Selections.includes(key)) {
                    Selections.push(key);
                }
            } else {
                // if it is uncheck and Seletions has the element
                if (Selections.includes(key)) {
                    var index = Selections.indexOf(key);
                    if (index > -1) {
                        Selections.splice(index, 1); //remove the element
                    }
                }
            }

        }
        // Return the array if it is non-empty, or null
        console.log(Selections)
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

            const searchFilter = (row) => {
                if (this.state.term === "") {
                    return true;
                }
                if (row["gsm"].includes(this.state.term)) return true;
                if (row["title"].includes(this.state.term)) return true;
                if (row["description"].includes(this.state.term)) return true;

                return false;
            }
            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };

            content = <div>
                <div> <Search aria-label="search" placeholder = "input search text"
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