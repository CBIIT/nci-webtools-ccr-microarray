import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';
import ReactSVG from 'react-svg';

const Search = Input.Search;
const Option = Select.Option;
const Selections = [];

const minWidth = 150;

class GSMData extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    term: '',
    boxplot: '',
    pagination: {
      current: 1,
      pageSize: 25
    },
    data: { totalCount: 0, records: [] },
    renderData: { totalCount: 0, records: [] },
    sorter: { field: 'gsm', order: 'ascend' }
  };
  constructor(props) {
    super(props);
    this.state.renderData = this.props.data.dataList;
    this.state.data = this.props.data.dataList;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let currentState = Object.assign({}, this.state);
    if (nextProps.data.dataList.length != currentState.data.length) {
      currentState.data = nextProps.data.dataList;
      currentState.renderData = nextProps.data.dataList;
      currentState.pagination.total = nextProps.data.dataList.length;
      this.setState(currentState);
    }
    this.isDataTableRendered('UNSAFE_componentWillReceiveProps');
  }

  isDataTableRendered(t) {
    clean508();

    function clean508() {
      let selectBox = document.getElementById('gsm-select');
      if (selectBox) {
        let checkboxes = document.getElementsByClassName('ant-checkbox-wrapper');
        if (checkboxes) {
          if (checkboxes.length != 0) {
            // clearInterval(isDataTableRendered_iv);
            for (let i in checkboxes) {
              if (i != 'length') {
                if (checkboxes[i]) {
                  if (checkboxes[i].firstElementChild) {
                    if (checkboxes[i].firstElementChild.firstElementChild) {
                      let inputC = checkboxes[i].firstElementChild.firstElementChild;
                      inputC.setAttribute('id', 'select' + i);
                      inputC.setAttribute('aria-label', 'select');
                      let inputD = checkboxes[i];
                      inputD.setAttribute('for', 'select' + i);
                    }
                  }
                }
              }

              let node = document.createElement('span');

              node.style.cssText = 'display:none';
              let textnode = document.createTextNode('select groups');
              node.appendChild(textnode);
              if (!isNaN(parseInt(i))) {
                document
                  .getElementsByClassName('ant-checkbox-wrapper')
                  [parseInt(i)].appendChild(node);
              }
            }
          }
        }
      } else {
        // clearInterval(isDataTableRendered_iv);
      }
    }
  }

  onSelectChange = selectedRowKeys => {
    this.props.selected(selectedRowKeys);
    let currentState = Object.assign({}, this.state);
    currentState.selectedRowKeys = selectedRowKeys;
    this.setState(currentState);
  };

  unselect = () => {
    let currentState = Object.assign({}, this.state);
    currentState.selectedRowKeys = [];
    currentState.loading = false;
    this.setState(currentState);
  };

  handleSelection = key => {
    let selectedRowKeys = this.getCheckedBoxes('select-GSM');
  };

  handleMenuClick = e => {
    let currentState = Object.assign({}, this.state);
    currentState.pagination.pageSize = parseInt(e.key);
    currentState.pagination.current = 1;
    document.getElementById('gsm-drop-down').innerHTML = e.key;
    let renderData = currentState.data;
    if (this.state.term != '') {
      renderData = [];
      for (var i = currentState.data.length - 1; i >= 0; i--) {
        let flag = false;
        if (currentState.data[i]['gsm'].includes(this.state.term)) flag = true;
        if (currentState.data[i]['title'].includes(this.state.term)) flag = true;
        if (currentState.data[i]['description'].includes(this.state.term)) flag = true;
        if (flag) {
          renderData.push(currentState.data[i]);
        }
      }
    }

    // sort data
    if (currentState.sorter.field == 'gsm') {
      if (currentState.sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return ('' + b.gsm).localeCompare(a.gsm);
        });
      } else {
        renderData.sort(function(a, b) {
          return ('' + a.gsm).localeCompare(b.gsm);
        });
      }
    }

    // sort data
    if (currentState.sorter.field == 'title') {
      if (currentState.sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return ('' + b.title).localeCompare(a.title);
        });
      } else {
        renderData.sort(function(a, b) {
          return ('' + a.title).localeCompare(b.title);
        });
      }
    }

    // sort data
    if (currentState.sorter.field == 'description') {
      if (currentState.sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return a.description.length > b.description.length;
        });
      } else {
        renderData.sort(function(a, b) {
          return !a.description.length > b.description.length;
        });
      }
    }

    if (currentState.sorter.field == 'groups') {
      if (currentState.sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return a.groups.length > b.groups.length;
        });
      } else {
        renderData.sort(function(a, b) {
          return !a.groups.length > b.groups.length;
        });
      }
    }

    let start_index = currentState.pagination.pageSize * (currentState.pagination.current - 1);
    let end_index = currentState.pagination.pageSize * currentState.pagination.current;
    if (end_index > renderData.length) {
      end_index = renderData.length;
    }
    currentState.renderData = renderData.slice(start_index, end_index);

    this.setState(currentState);
  };

  // Pass the checkbox name to the function
  getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByClassName(chkboxName);
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
      // And stick the checked ones onto an array...
      let key = parseInt(
        checkboxes[i].parentElement.parentElement.parentElement.getAttribute('data-row-key')
      );
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
  }

  handlePageChange = (pagination, filters, sorter) => {
    let set = Object.assign({}, this.state);

    set.pagination = {
      pageSize: pagination.pageSize,
      current: pagination.current ? pagination.current : 1
    };
    let renderData = set.data;
    set.sorter.field = sorter.field;
    set.sorter.order = sorter.order;

    if (this.state.term != '') {
      renderData = [];
      for (var i = set.data.length - 1; i >= 0; i--) {
        let flag = false;
        if (set.data[i]['gsm'].includes(this.state.term)) flag = true;
        if (set.data[i]['title'].includes(this.state.term)) flag = true;
        if (set.data[i]['description'].includes(this.state.term)) flag = true;
        if (flag) {
          renderData.push(set.data[i]);
        }
      }
    }

    // sort data
    if (sorter.field == 'gsm') {
      if (sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return ('' + b.gsm).localeCompare(a.gsm);
        });
      } else {
        renderData.sort(function(a, b) {
          return ('' + a.gsm).localeCompare(b.gsm);
        });
      }
    }

    // sort data
    if (sorter.field == 'title') {
      if (sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return ('' + b.title).localeCompare(a.title);
        });
      } else {
        renderData.sort(function(a, b) {
          return ('' + a.title).localeCompare(b.title);
        });
      }
    }

    // sort data
    if (sorter.field == 'description') {
      if (sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return a.description.length > b.description.length;
        });
      } else {
        renderData.sort(function(a, b) {
          return !(a.description.length > b.description.length);
        });
      }
    }

    if (sorter.field == 'groups') {
      if (sorter.order == 'descend') {
        renderData.sort(function(a, b) {
          return a.groups.length > b.groups.length;
        });
      } else {
        renderData.sort(function(a, b) {
          return !(a.groups.length > b.groups.length);
        });
      }
    }

    let start_index = pagination.pageSize * (pagination.current - 1);
    let end_index = pagination.pageSize * pagination.current;
    if (end_index > renderData.length) {
      end_index = renderData.length;
    }
    set.renderData = renderData.slice(start_index, end_index);
    this.setState(set);
  };

  render() {
    const searchFilter = row => {
      if (this.state.term === '') {
        return true;
      }
      if (row['gsm'] && row['gsm'].includes(this.state.term)) return true;
      if (row['title'] && row['title'].includes(this.state.term)) return true;
      if (row['description'] && row['description'].includes(this.state.term)) return true;

      return false;
    };

    const { loading, selectedRowKeys } = this.state;
    const filteredData = this.state.renderData.filter(searchFilter, this);
    const minLength = 15;
    if (filteredData.length < minLength) {
    }

    let content = (
      <div>
        <div className="err-message" id="message-gsm"></div>
        <p>
          Choose an Analysis Type on the left panel and click on the Load button to see a list of
          GSM displayed here.{' '}
        </p>
      </div>
    );

    if (this.props.data.dataList.length > 0) {
      const columns = [
        {
          title: 'GSM',
          dataIndex: 'gsm',
          width: '18%',
          defaultSortOrder: 'ascend',
          sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
          render: (text, record, index) => (
            <div
              className="single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.18 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.18
                    : minWidth
              }}
            >
              <span data-toggle="tooltip" data-placement="left" title={text}>
                {text}
              </span>
            </div>
          )
        },
        {
          title: 'TITLE',
          dataIndex: 'title',
          width: '30%',
          sorter: (a, b) => ('' + a.title).localeCompare(b.title),
          render: (text, record, index) => (
            <div
              className="single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.3 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.3
                    : minWidth
              }}
            >
              <span data-toggle="tooltip" data-placement="left" title={text}>
                {text}
              </span>
            </div>
          )
        },
        {
          title: 'DESCRIPTION',
          dataIndex: 'description',
          width: '30%',
          sorter: (a, b) => a.description.length - b.description.length,
          render: (text, record, index) => (
            <div
              className="single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.3 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.3
                    : minWidth
              }}
            >
              <span data-toggle="tooltip" data-placement="left" title={text}>
                {text}
              </span>
            </div>
          )
        },
        {
          title: 'GROUP',
          dataIndex: 'groups',
          width: '15%',
          sorter: (a, b) => ('' + a.groups).localeCompare(b.groups),
          render: (text, record, index) => (
            <div
              className="single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.15 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.15
                    : minWidth
              }}
            >
              <span data-toggle="tooltip" data-placement="left" title={text}>
                {text}
              </span>
            </div>
          )
        }
      ];
      let count = 1;

      this.props.data.dataList.forEach(function(fl) {
        fl.key = count++;
      });

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
        onChange: this.onSelectChange
      };

      content = (
        <div>
          <div className="err-message" id="message-gsm"></div>
          <div>
            <Search
              aria-label="search"
              placeholder="Search text"
              className="input-search-gsm"
              onSearch={value =>
                this.setState({ term: value, renderData: this.props.data.dataList })
              }
            />
          </div>

          <div
            id="gsm-select"
            style={{
              display: filteredData.length < 15 ? 'none' : 'block'
            }}
          >
            Display
            <Dropdown overlay={menu}>
              <Button>
                <span id="gsm-drop-down">{Math.min(25, filteredData.length)}</span>{' '}
                <Icon type="down" />
              </Button>
            </Dropdown>
            of total {filteredData.length} records
          </div>

          {filteredData.length < 15 && (
            <div>
              Displaying <b>{filteredData.length}</b> record(s)
            </div>
          )}
          <div>
            <Table
              scroll={{ x: 600 }}
              pagination={this.state.pagination}
              rowSelection={rowSelection}
              columns={columns}
              onChange={this.handlePageChange}
              dataSource={this.state.renderData.filter(searchFilter, this)}
            />
          </div>
        </div>
      );
    }

    return content;
  }
}

export default GSMData;
