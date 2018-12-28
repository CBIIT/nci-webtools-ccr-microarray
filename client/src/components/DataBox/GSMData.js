import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';
import ReactSVG from 'react-svg'

const Search = Input.Search;
const Option = Select.Option;
const Selections = []

class GSMData extends Component {

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        term: "",
        boxplot: "",
        pagination: {
            current: 1,
            pageSize: 25
        },
        data: { totalCount: 0, records: [] },
        renderData: { totalCount: 0, records: [] },
        sorter:{field:"gsm",order:"descend"}

    };
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps(nextProps) {
        let currentState = Object.assign({}, this.state);
        if (nextProps.data.dataList.length != currentState.data.length) {
            currentState.data = nextProps.data.dataList;
            currentState.renderData = nextProps.data.dataList;
            currentState.pagination.total = nextProps.data.dataList.length;
            this.setState(currentState)
        }


    }

componentDidMount(){
    this.isDataTableRendered("componentDidMount")
}
componentDidUpdated(){
    this.isDataTableRendered("componentDidUpdated")
}


isDataTableRendered(t){
    let checkboxes = document.getElementsByClassName("ant-checkbox-wrapper")
        if(checkboxes.length!=0){
             console.log("rendered")
             console.log(t)
        }
}



    onSelectChange = (selectedRowKeys) => {
        this.props.selected(selectedRowKeys);
        let currentState = Object.assign({}, this.state);
        currentState.selectedRowKeys = selectedRowKeys;
        this.setState(currentState);
    }


    unselect = () => {
        let currentState = Object.assign({}, this.state);
        currentState.selectedRowKeys = [];
        currentState.loading = false;
        this.setState(currentState)

    }


    handleSelection = (key) => {
        console.log(key)
        let selectedRowKeys = this.getCheckedBoxes("select-GSM")
    }


    handleMenuClick = (e) => {
        console.log('click', e);
        let currentState = Object.assign({}, this.state);
        currentState.pagination.pageSize = parseInt(e.key);
        currentState.pagination.current = 1;
        document.getElementById("gsm-drop-down").innerHTML=e.key
        let renderData = currentState.data;

          // sort data
        if(currentState.sorter.field=="gsm"){
            if(currentState.sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  ('' + b.gsm).localeCompare(a.gsm)
                })
            }else{
                renderData.sort(function(a,b){
                   return  ('' + a.gsm).localeCompare(b.gsm)
                })
            }
        }

         // sort data
        if(currentState.sorter.field=="title"){
            if(currentState.sorter.order=="descend"){
                renderData.sort(function(a,b){
                    return   ('' + b.title).localeCompare(a.title)
                })
            }else{
                renderData.sort(function(a,b){
                    return   ('' + a.title).localeCompare(b.title)
                })
            }
        }

         // sort data
        if(currentState.sorter.field=="description"){
            if(currentState.sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  a.description.length > b.description.length
                })
            }else{
                renderData.sort(function(a,b){
                   return  !a.description.length > b.description.length
                })
            }
        }

          if(currentState.sorter.field=="groups"){
            if(currentState.sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  a.groups.length > b.groups.length
                })
            }else{
                renderData.sort(function(a,b){
                   return  !a.groups.length > b.groups.length
                })
            }
        }

        if (this.state.term != "") {
            for (var i = currentState.data.length - 1; i >= 0; i--) {
                let flag = false;
                if (currentState.data[i]["gsm"].includes(this.state.term)) flag = true;
                if (currentState.data[i]["title"].includes(this.state.term)) flag = true;
                if (currentState.data[i]["description"].includes(this.state.term)) flag = true;
                if (flag) {
                    renderData.push(currentState.data[i])
                }
            }
        }
        let start_index = currentState.pagination.pageSize * (currentState.pagination.current - 1)
        let end_index = currentState.pagination.pageSize * (currentState.pagination.current)
        if (end_index > renderData.length) {
            end_index = renderData.length;
        }
        currentState.renderData = renderData.slice(start_index, end_index);

        this.setState(currentState);
    }

    // Pass the checkbox name to the function
    getCheckedBoxes(chkboxName) {
        var checkboxes = document.getElementsByClassName(chkboxName);
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            let key = parseInt(checkboxes[i].parentElement.parentElement.parentElement.getAttribute("data-row-key"));
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




    handlePageChange = (pagination, filters, sorter) => {
        let set = Object.assign({}, this.state);

        set.pagination = {
            pageSize: pagination.pageSize,
            current: pagination.current ? pagination.current : 1
        }
        let renderData = set.data;
        set.sorter.field=sorter.field;
        set.sorter.order=sorter.order;
        // sort data
        if(sorter.field=="gsm"){
            if(sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  ('' + b.gsm).localeCompare(a.gsm)
                })
            }else{
                renderData.sort(function(a,b){
                   return  ('' + a.gsm).localeCompare(b.gsm)
                })
            }
        }

         // sort data
        if(sorter.field=="title"){
            if(sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return   ('' + b.title).localeCompare(a.title)
                })
            }else{
                renderData.sort(function(a,b){
                   return   ('' + a.title).localeCompare(b.title)
                })
            }
        }

         // sort data
        if(sorter.field=="description"){
            if(sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  a.description.length > b.description.length
                })
            }else{
                renderData.sort(function(a,b){
                   return  !(a.description.length > b.description.length)
                })
            }
        }

          if(sorter.field=="groups"){
            if(sorter.order=="descend"){
                renderData.sort(function(a,b){
                   return  a.groups.length > b.groups.length
                })
            }else{
                renderData.sort(function(a,b){
                   return  !(a.groups.length > b.groups.length)
                })
            }
        }

        if (this.state.term != "") {
            for (var i = set.data.length - 1; i >= 0; i--) {
                let flag = false;
                if (set.data[i]["gsm"].includes(this.state.term)) flag = true;
                if (set.data[i]["title"].includes(this.state.term)) flag = true;
                if (set.data[i]["description"].includes(this.state.term)) flag = true;
                if (flag) {
                    renderData.push(set.data[i])
                }
            }
        }

        let start_index = pagination.pageSize * (pagination.current - 1)
        let end_index = pagination.pageSize * (pagination.current)
        if (end_index > renderData.length) {
            end_index = renderData.length;
        }
        set.renderData = renderData.slice(start_index, end_index);
        this.setState(set)
    }

    render() {

        const { loading, selectedRowKeys } = this.state;

        let content = <div>
            <div className="err-message" id="message-gsm"></div>
            <p>Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here. </p>
       </div>;

        if (this.props.data.dataList.length > 0) {
            const columns = [{
                title: 'GSM',
                dataIndex: 'gsm',
                width: '18%',
                defaultSortOrder: 'descend',
                sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.18}}>
                              <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                          </div>
                ),
            }, {
                title: 'TITLE',
                dataIndex: 'title',
                width: '30%',
                sorter: (a, b) => ('' + a.title).localeCompare(b.title),
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.3}}>
                          <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'DESCRIPTION',
                dataIndex: 'description',
                width: '30%',
                sorter: (a, b) => a.description.length - b.description.length,
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.3}}>
                          <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }, {
                title: 'GROUP',
                dataIndex: 'groups',
                width: '15%',
                sorter: (a, b) => ('' + a.groups).localeCompare(b.groups),
                render: (text, record, index) => (
                    <div className="single-line" style={{"maxWidth":document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.15}}>
                          <span data-toggle="tooltip" data-placement="left" title={text}>{text}</span>
                      </div>
                ),
            }];
            let count = 1;

            this.props.data.dataList.forEach(function(fl) {
                fl.key = count++;
            });


         

            const searchFilter = (row) => {
                if (this.state.term === "") {
                    return true;
                }
                if (row["gsm"].includes(this.state.term)) return true;
                if (row["title"].includes(this.state.term)) return true;
                if (row["description"].includes(this.state.term)) return true;

                return false;
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

            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };




            content = <div>
                        <div>
                            <Search aria-label="search" placeholder = "input search text"
                                    className = "input-search-gsm"
                                    onSearch = { value => this.setState({ term: value }) }
                            />
                        </div>
                        <div id="gsm-select">show 
                            <Dropdown overlay={menu}>
                                  <Button >
                                    <span id="gsm-drop-down">25</span> <Icon type="down" />
                                  </Button>
                            </Dropdown>of total {this.state.data.length} records

                        </div>
                        <div> 
                        <Table 
                            scroll={{ x: 960}} 
                            pagination={this.state.pagination}  
                            rowSelection = { rowSelection } 
                            columns = { columns } 
                            dataSource = { this.state.renderData}
                            onChange={this.handlePageChange}    
                                />
                        </div>
                    </div>

        }

        return content;
    }
}

export default GSMData;