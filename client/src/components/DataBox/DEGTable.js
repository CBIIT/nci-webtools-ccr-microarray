import React from 'react';
import { Menu, Dropdown, Button, Icon, Table, Input, Pagination } from 'antd';
import { Tooltip } from '../Tooltip/Tooltip';
const Search = Input.Search;

const minWidth = 110;
const exponentialNum = 3;

export default function DEGTable(props) {
  function handleMenuClick(e) {
    document.getElementById('deg-drop-down').innerHTML = e.key;
    props.getDEG({
      page_size: parseInt(e.key),
      page_number: 1,
      sorting: props.data.diff_expr_genes.sorting,
      search_keyword: props.data.diff_expr_genes.search_keyword,
    });
  }

  function handleExportMenuClick(e) {
    if (e.key == 1) {
      props.exportDEG();
    } else {
      props.exportNormalAll();
    }
  }

  function sorter(field, order) {
    if (!field) {
      field = 'P.Value';
    }
    if (!order) {
      order = 'ascend';
    }
    props.getDEG({
      page_size: props.data.diff_expr_genes.pagination.pageSize,
      page_number: props.data.diff_expr_genes.pagination.current,
      sorting: {
        name: field,
        order: order,
      },
      search_keyword: props.data.diff_expr_genes.search_keyword,
    });
  }

  let content = '';
  const columns = [
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_symbol">
            <span style={{ display: 'none' }}>input_deg_search_symbol</span>
            <Input
              aria-label="input_deg_search_symbol"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_symbol == ''
                  ? 'SYMBOL'
                  : props.data.diff_expr_genes.search_keyword.search_symbol
              }
              id="input_deg_search_symbol"
            />
          </label>
          <div>
            <div className="head-title"> SYMBOL </div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'SYMBOL' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('SYMBOL', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'SYMBOL' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('SYMBOL', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'SYMBOL',
      sorter: false,
      width: '8%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line deg_SYMBOL"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_fc">
            <span style={{ display: 'none' }}>input_deg_search_fc</span>
            <Input
              aria-label="input_deg_search_fc"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_fc == ''
                  ? 'FC'
                  : props.data.diff_expr_genes.search_keyword.search_fc
              }
              id="input_deg_search_fc"
            />
          </label>
          <div>
            <div className="head-title"> FC </div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'FC' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('FC', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'FC' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('FC', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'FC',
      sorter: false,
      width: '6%',
      render: (text, record, index) => {
        return (
          <div
            className="deg_fc single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.06 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {Number.parseFloat(text).toFixed(3)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ text: 'center' }}>
          <label htmlFor="input_dge_search_p_value">
            <span style={{ display: 'none' }}>input_dge_search_p_value</span>
            <Input
              aria-label="input_dge_search_p_value"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_p_value == ''
                  ? 'P.Value'
                  : props.data.diff_expr_genes.search_keyword.search_p_value
              }
              id="input_dge_search_p_value"
            />
          </label>
          <div>
            <div className="head-title"> P.Value</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'P.Value' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('P.Value', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'P.Value' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('P.Value', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'P.Value',
      sorter: false,
      width: '8%',
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div
            className="p_value single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {Number.parseFloat(text).toExponential(exponentialNum)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_adj_p_value">
            <span style={{ display: 'none' }}>input_deg_search_adj_p_value</span>
            <Input
              aria-label="input_deg_search_adj_p_value"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_adj_p_value == ''
                  ? 'adj.P.Val'
                  : props.data.diff_expr_genes.search_keyword.search_adj_p_value
              }
              id="input_deg_search_adj_p_value"
            />
          </label>
          <div>
            <div className="head-title"> adj.P.Val</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'adj.P.Val' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('adj.P.Val', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'adj.P.Val' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('adj.P.Val', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'adj.P.Val',
      sorter: false,
      width: '8%',
      render: (text, record, index) => {
        return (
          <div
            className="adj_p_value single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {Number.parseFloat(text).toExponential(exponentialNum)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_aveexpr">
            <span style={{ display: 'none' }}>input_deg_search_aveexpr</span>
            <Input
              aria-label="input_deg_search_aveexpr"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_aveexpr == ''
                  ? 'AveExpr'
                  : props.data.diff_expr_genes.search_keyword.search_aveexpr
              }
              id="input_deg_search_aveexpr"
            />
          </label>
          <div>
            <div className="head-title"> AveExpr</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'AveExpr' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('AveExpr', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'AveExpr' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('AveExpr', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'AveExpr',
      sorter: false,
      width: '8%',
      render: (text, record, index) => {
        return (
          <div
            className="aveexpr single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_input_deg_search_accnum">
            <span style={{ display: 'none' }}>input_deg_search_accnum</span>
            <Input
              aria-label="input_deg_search_accnum"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_accnum == ''
                  ? 'ACCNUM'
                  : props.data.diff_expr_genes.search_keyword.search_accnum
              }
              id="input_deg_search_accnum"
            />
          </label>
          <div>
            <div className="head-title"> ACCNUM</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'ACCNUM' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('ACCNUM', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'ACCNUM' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('ACCNUM', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'ACCNUM',
      sorter: false,
      width: '9%',
      render: (text, record, index) => {
        return (
          <div
            className="accnum single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.09 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.12
                  : minWidth + 50,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_desc">
            <span style={{ display: 'none' }}>input_deg_search_desc</span>
            <Input
              aria-label="input_deg_search_desc"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_desc == ''
                  ? 'DESC'
                  : props.data.diff_expr_genes.search_keyword.search_desc
              }
              id="input_deg_search_desc"
            />
          </label>
          <div>
            <div className="head-title"> DESC</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'DESC' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('DESC', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'DESC' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('DESC', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'DESC',
      sorter: false,
      width: '15%',
      render: (text, record, index) => {
        return (
          <div
            className="deg_desc single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.15 >
                150
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.15
                  : 150,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_entrez">
            <span style={{ display: 'none' }}>input_deg_search_entrez</span>
            <Input
              aria-label="input_deg_search_entrez"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_entrez == ''
                  ? 'ENTREZ'
                  : props.data.diff_expr_genes.search_keyword.search_entrez
              }
              id="input_deg_search_entrez"
            />
          </label>
          <div>
            <div className="head-title"> ENTREZ</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'ENTREZ' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('ENTREZ', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'ENTREZ' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('ENTREZ', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'ENTREZ',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        if (text != '' && text != 'NA') {
          let link = 'https://www.ncbi.nlm.nih.gov/gene/' + text;
          return (
            <div
              className="deg_entrez single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.11
                    : minWidth,
              }}
            >
              <span data-toggle="tooltip" data-placement="left" title={text}>
                {' '}
                <a href={link} target="_blank">
                  {text}
                </a>
              </span>
            </div>
          );
        } else {
          return (
            <div
              className="deg_entrez single-line"
              style={{
                maxWidth:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
                  minWidth
                    ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth *
                      0.11
                    : minWidth,
              }}
            >
              <Tooltip title={text}>
                {text}
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_probsetid">
            <span style={{ display: 'none' }}>input_deg_search_probsetid</span>
            <Input
              aria-label="input_deg_search_probsetid"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_probsetid == ''
                  ? 'probsetID'
                  : props.data.diff_expr_genes.search_keyword.search_probsetid
              }
              id="input_deg_search_probsetid"
            />
          </label>
          <div>
            <div className="head-title"> probsetID</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'probsetID' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('probsetID', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'probsetID' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('probsetID', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'probsetID',
      sorter: false,
      width: '8%',
      render: (text, record, index) => {
        return (
          <div
            className="deg_probsetid single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_t">
            <span style={{ display: 'none' }}>input_deg_search_t</span>
            <Input
              aria-label="input_deg_search_t"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_t == ''
                  ? 't'
                  : props.data.diff_expr_genes.search_keyword.search_t
              }
              id="input_deg_search_t"
            />
          </label>
          <div>
            <div className="head-title"> t</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 't' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('t', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 't' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('t', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 't',
      sorter: false,
      width: '5%',
      render: (text, record, index) => {
        return (
          <div
            className="deg_t  single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.05 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.05
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {Number.parseFloat(text)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_deg_search_b">
            <span style={{ display: 'none' }}>input_deg_search_b</span>
            <Input
              aria-label="input_deg_search_b"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.diff_expr_genes.search_keyword.search_b == ''
                  ? 'b'
                  : props.data.diff_expr_genes.search_keyword.search_b
              }
              id="input_deg_search_b"
            />
          </label>
          <div>
            <div className="head-title"> b</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'b' &&
                      props.data.diff_expr_genes.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('b', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.diff_expr_genes.sorting.name == 'b' &&
                      props.data.diff_expr_genes.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('b', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'B',
      sorter: false,
      width: '5%',
      render: (text, record, index) => {
        return (
          <div
            className="deg_b single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.05 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.05
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const search = (e) => {
    var search_symbol = document.getElementById('input_deg_search_symbol').value;
    var search_fc = document.getElementById('input_deg_search_fc').value;
    var search_p_value = document.getElementById('input_dge_search_p_value').value;
    var search_adj_p_value = document.getElementById('input_deg_search_adj_p_value').value;
    var search_aveexpr = document.getElementById('input_deg_search_aveexpr').value;
    var search_accnum = document.getElementById('input_deg_search_accnum').value;
    var search_desc = document.getElementById('input_deg_search_desc').value;
    var search_entrez = document.getElementById('input_deg_search_entrez').value;
    var search_probsetid = document.getElementById('input_deg_search_probsetid').value;
    var search_t = document.getElementById('input_deg_search_t').value;
    var search_b = document.getElementById('input_deg_search_b').value;

    props.getDEG({
      page_size: 25,
      page_number: 1,
      sorting: {
        name: 'P.Value',
        order: 'ascend',
      },
      search_keyword: {
        search_symbol: search_symbol,
        search_fc: Number(search_fc),
        search_p_value: Number(search_p_value),
        search_adj_p_value: Number(search_adj_p_value),
        search_aveexpr: Number(search_aveexpr),
        search_accnum: search_accnum,
        search_desc: search_desc,
        search_entrez: search_entrez,
        search_probsetid: search_probsetid,
        search_t: Number(search_t),
        search_b: Number(search_b),
      },
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="15">15</Menu.Item>
      <Menu.Item key="25">25</Menu.Item>
      <Menu.Item key="50">50</Menu.Item>
      <Menu.Item key="100">100</Menu.Item>
      <Menu.Item key="200">200</Menu.Item>
    </Menu>
  );

  const ExportMenu = (
    <Menu onClick={handleExportMenuClick}>
      <Menu.Item key="1">DEG Table Results</Menu.Item>
      <Menu.Item key="2">Normalized Data</Menu.Item>
    </Menu>
  );

  content = (
    <div>
      {props.data.diff_expr_genes.message && (
        <div>
          <p className="err-message" id="message-deg">
            {props.data.diff_expr_genes.message}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id="deg-select" className="col" style={{ marginRight: 'auto' }}>
          <Dropdown overlay={menu}>
            <Button>
              <span id="deg-drop-down">25</span> <Icon type="down" />
            </Button>
          </Dropdown>
          rows per page
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <span>
            Showing{' '}
            {1 +
              (props.data.diff_expr_genes.pagination.current - 1) *
                props.data.diff_expr_genes.pagination.pageSize}
            -
            {(props.data.diff_expr_genes.pagination.current - 1) *
              props.data.diff_expr_genes.pagination.pageSize +
              props.data.diff_expr_genes.data.length}{' '}
            of {props.data.diff_expr_genes.pagination.total} records
          </span>
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <Pagination
            {...props.data.diff_expr_genes.pagination}
            onChange={(page, pageSize) =>
              props.getDEG({
                page_size: pageSize,
                page_number: page,
                sorting: props.data.diff_expr_genes.sorting,
                search_keyword: props.data.diff_expr_genes.search_keyword,
              })
            }
          />
        </div>

        <div className="div-export-deg col">
          <Dropdown overlay={ExportMenu}>
            <Button id="btn-deg-export" type="primary">
              <span id="deg-export-drop-down">Export</span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={props.data.diff_expr_genes.data}
          pagination={false}
          loading={props.data.diff_expr_genes.loading}
          scroll={{ x: 600 }}
        />
      </div>
    </div>
  );

  return content;
}
