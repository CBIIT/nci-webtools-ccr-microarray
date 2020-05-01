import React, { useState } from 'react';
import {
  Menu,
  Dropdown,
  Icon,
  Table,
  Input,
  message,
  Modal,
  Button,
  Tooltip,
  Pagination,
} from 'antd';
const Search = Input.Search;
const minWidth = 110;
const exponentialNum = 3;

export default function PUGTable(props) {
  const [state, setState] = useState({
    term: '',
    heapMap: '',
    visible: false,
    table_content: '',
  });

  function handleMenuClick(e) {
    document.getElementById('pd-drop-down').innerHTML = e.key;
    props.getPathwayDown({
      page_size: parseInt(e.key),
      page_number: 1,
      sorting: {
        name: props.data.pathways_down.sorting.name,
        order: props.data.pathways_down.sorting.order,
      },
      search_keyword: props.data.pathways_down.search_keyword,
    });
  }

  function handleExportMenuClick(e) {
    if (e.key == 1) {
      props.exportPathwayDown();
    } else {
      props.exportNormalAll();
    }
  }

  function sorter(field, order) {
    if (!field) {
      field = 'P_Value';
    }

    if (!order) {
      order = 'ascend';
    }

    props.getPathwayDown({
      page_size: props.data.pathways_down.pagination.pageSize,
      page_number: props.data.pathways_down.pagination.current,
      sorting: {
        name: field,
        order: order,
      },
      search_keyword: props.data.pathways_down.search_keyword,
    });
  }

  function handleOk() {
    setState({ loading: true });
    setTimeout(() => {
      setState({ loading: false, visible: false });
    }, 3000);
  }

  function handleCancel() {
    setState({ group: '', selected: [], visible: false });
  }

  function showHeatMap(idx) {
    // not reflected in interface
    let reqBody = {};
    reqBody.projectId = props.data.projectID;
    reqBody.group1 = props.data.group_1;
    reqBody.group2 = props.data.group_2;
    reqBody.upOrDown = 'downregulated_pathways';
    reqBody.pathway_name = props.data.pathways_down.data[idx.index].Description;
    props.changeLoadingStatus(true, 'loading HeatMap');
    var importantStuff = window.open(window.location.origin + '/assets/loading.html', '_blank');

    fetch('./api/analysis/pathwaysHeapMap', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        props.changeLoadingStatus(false, '');
        if (result.status == 200) {
          if (Object.keys(result.data).length == 0 || result.data.constructor == Object) {
            importantStuff.location.href = window.location.origin + '/assets/noheatmap.html';
          } else {
            let pic_link = JSON.parse(result.data).pic_name;
            var link = 'images/' + props.data.projectID + '/' + pic_link;
            importantStuff.location.href = window.location.origin + '/' + link;
          }
        } else {
          message.success('no rows to aggregate');
        }
      });
  }

  const { visible } = state;
  let content = '';

  const columns = [
    {
      title: (
        <div className="pathway_pathways_id_head">
          <label htmlFor="input_pathway_down_search_PATHWAY_ID">
            <span style={{ display: 'none' }}>input_pathway_down_search_PATHWAY_ID</span>
            <Input
              aria-label="input_pathway_down_search_PATHWAY_ID"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_PATHWAY_ID == ''
                  ? 'PATHWAY_ID'
                  : props.data.pathways_down.search_keyword.search_PATHWAY_ID
              }
              id="input_pathway_down_search_PATHWAY_ID"
            />
          </label>
          <div>
            <div className="head-title"> PATHWAY_ID</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Pathway_ID' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Pathway_ID', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Pathway_ID' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Pathway_ID', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Pathway_ID',
      width: '10%',
      key: 'Pathway_ID',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth,
            }}
          >
            <span
              style={{ color: 'rgb(0, 0, 255)' }}
              data-toggle="tooltip"
              data-placement="left"
              title={text}
            >
              <a style={{ color: 'rgb(0, 0, 255)' }} onClick={() => showHeatMap({ index })}>
                <Icon type="area-chart" /> {text}
              </a>
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_source_head">
          <label htmlFor="input_pathway_down_search_SOURCE">
            <span style={{ display: 'none' }}>input_pathway_down_search_SOURCE</span>
            <Input
              aria-label="input_pathway_down_search_SOURCE"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_SOURCE == ''
                  ? 'SOURCE'
                  : props.data.pathways_down.search_keyword.search_SOURCE
              }
              id="input_pathway_down_search_SOURCE"
            />
          </label>
          <div>
            <div className="head-title"> SOURCE</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Source' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Source', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Source' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Source', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Source',
      width: '8%',
      key: 'Source',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.09 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.09
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_desc_head">
          <label htmlFor="input_pathway_down_search_DESCRIPTION">
            <span style={{ display: 'none' }}>input_pathway_down_search_DESCRIPTION</span>
            <Input
              aria-label="input_pathway_down_search_DESCRIPTION"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_DESCRIPTION == ''
                  ? 'DESC'
                  : props.data.pathways_down.search_keyword.search_DESCRIPTION
              }
              id="input_pathway_down_search_DESCRIPTION"
            />
          </label>
          <div>
            <div className="head-title"> DESCRIPTION</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Description' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Description', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Description' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Description', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Description',
      width: '12%',
      key: 'Description',
      sorter: false,
      render: (text, record, index) => (
        <div
          className="single-line"
          style={{
            maxWidth:
              document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                : minWidth,
          }}
        >
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: (
        <div className="pathway_p_value_head">
          <label htmlFor="input_pathway_down_search_p_value">
            <span style={{ display: 'none' }}>input_pathway_down_search_p_value</span>
            <Input
              aria-label="input_pathway_down_search_p_value"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_p_value == ''
                  ? 'P_VALUE'
                  : props.data.pathways_down.search_keyword.search_p_value
              }
              id="input_pathway_down_search_p_value"
            />
          </label>
          <div>
            <div className="head-title"> P_VALUE</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'P_Value' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('P_Value', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'P_Value' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('P_Value', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'P_Value',
      width: '8%',
      key: 'P_Value',
      sorter: false,
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {Number.parseFloat(text) != 0
                ? Number.parseFloat(text).toExponential(exponentialNum)
                : Number.parseFloat(text)}{' '}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_fdr_head">
          <label htmlFor="input_pathway_down_search_fdr">
            <span style={{ display: 'none' }}>input_pathway_down_search_fdr</span>
            <Input
              aria-label="input_pathway_down_search_fdr"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_fdr == ''
                  ? 'FDR'
                  : props.data.pathways_down.search_keyword.search_fdr
              }
              id="input_pathway_down_search_fdr"
            />
          </label>
          <div>
            <div className="head-title"> FDR</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'FDR' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('FDR', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'FDR' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('FDR', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'FDR',
      width: '8%',
      key: 'FDR',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {Number.parseFloat(text) != 0
                ? Number.parseFloat(text).toExponential(exponentialNum)
                : Number.parseFloat(text)}{' '}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_ratio_head">
          <label htmlFor="input_pathway_down_search_RATIO">
            <span style={{ display: 'none' }}>input_pathway_down_search_RATIO</span>
            <Input
              aria-label="input_pathway_down_search_RATIO"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_RATIO == ''
                  ? 'RATIO'
                  : props.data.pathways_down.search_keyword.search_RATIO
              }
              id="input_pathway_down_search_RATIO"
            />
          </label>
          <div>
            <div className="head-title"> RATIO</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Ratio' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Ratio', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Ratio' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Ratio', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Ratio',
      width: '8%',
      key: 'Ratio',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_number_hits_head">
          <label htmlFor="input_pathway_down_search_NUMBER_HITS">
            <span style={{ display: 'none' }}>input_pathway_down_search_NUMBER_HITS</span>
            <Input
              aria-label="input_pathway_down_search_NUMBER_HITS"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_NUMBER_HITS == ''
                  ? 'HITS'
                  : props.data.pathways_down.search_keyword.search_NUMBER_HITS
              }
              id="input_pathway_down_search_NUMBER_HITS"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_HITS</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_Hits' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_Hits', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_Hits' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_Hits', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Number_Hits',
      width: '8%',
      key: 'Number_Hits',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_number_hits_head">
          <label htmlFor="input_pathway_down_search_NUMBER_MISSES">
            <span style={{ display: 'none' }}>input_pathway_down_search_NUMBER_MISSES</span>
            <Input
              aria-label="input_pathway_down_search_NUMBER_MISSES"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_NUMBER_MISSES == ''
                  ? 'MISSES'
                  : props.data.pathways_down.search_keyword.search_NUMBER_MISSES
              }
              id="input_pathway_down_search_NUMBER_MISSES"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_MISSES</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_Misses' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_Misses', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_Misses' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_Misses', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Number_Misses',
      width: '8%',
      key: 'Number_Misses',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_number_user_genes_head">
          <label htmlFor="input_pathway_down_search_NUMBER_USER_GENES">
            <span style={{ display: 'none' }}>input_pathway_down_search_NUMBER_USER_GENES</span>
            <Input
              aria-label="input_pathway_down_search_NUMBER_USER_GENES"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_NUMBER_USER_GENES == ''
                  ? 'USER_GENES'
                  : props.data.pathways_down.search_keyword.search_NUMBER_USER_GENES
              }
              id="input_pathway_down_search_NUMBER_USER_GENES"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_USER_GENES</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_User_Genes' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_User_Genes', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Number_User_Genes' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Number_User_Genes', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Number_User_Genes',
      width: '8%',
      key: 'Number_User_Genes',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_total_number_genes_head">
          <label htmlFor="input_pathway_down_search_TOTAL_GENES_MINUS_INPUT">
            <span style={{ display: 'none' }}>
              input_pathway_down_search_TOTAL_GENES_MINUS_INPUT
            </span>
            <Input
              aria-label="input_pathway_down_search_TOTAL_GENES_MINUS_INPUT"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_TOTAL_GENES_MINUS_INPUT == ''
                  ? 'GENES'
                  : props.data.pathways_down.search_keyword.search_TOTAL_GENES_MINUS_INPUT
              }
              id="input_pathway_down_search_TOTAL_GENES_MINUS_INPUT"
            />
          </label>
          <div>
            <div className="head-title"> TOTAL_GENES_MINUS_INPUT</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Total_Genes_Minus_Input' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Total_Genes_Minus_Input', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Total_Genes_Minus_Input' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Total_Genes_Minus_Input', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Total_Genes_Minus_Input',
      width: '12%',
      key: 'Total_Genes_Minus_Input',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth,
            }}
          >
            <Tooltip placement="bottomLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_gene_list_head">
          <label htmlFor="input_pathway_down_search_GENE_LIST">
            <span style={{ display: 'none' }}>input_pathway_down_search_GENE_LIST</span>
            <Input
              aria-label="input_pathway_down_search_GENE_LIST"
              onPressEnter={(value) => search(value)}
              placeholder={
                props.data.pathways_down.search_keyword.search_GENE_LIST == ''
                  ? 'GENE_LIST'
                  : props.data.pathways_down.search_keyword.search_GENE_LIST
              }
              id="input_pathway_down_search_GENE_LIST"
            />
          </label>
          <div>
            <div className="head-title"> GENE_LIST</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Gene_List' &&
                      props.data.pathways_down.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Gene_List', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_down.sorting.name == 'Gene_List' &&
                      props.data.pathways_down.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc',
                  }}
                  onClick={() => sorter('Gene_List', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Gene_List',
      width: '10%',
      key: 'Gene_List',
      sorter: false,
      render: (text, record, index) => (
        <div
          className="single-line"
          style={{
            maxWidth:
              document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                : minWidth,
          }}
        >
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        </div>
      ),
    },
  ];

  // define group modal
  let modal = (
    <Modal
      width={'75%'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      <img src={state.heapMap} style={{ width: '100%' }} alt="heatMap" />
    </Modal>
  );
  // end  group modal

  const search = (e) => {
    var search_PATHWAY_ID = document.getElementById('input_pathway_down_search_PATHWAY_ID').value;
    var search_SOURCE = document.getElementById('input_pathway_down_search_SOURCE').value;
    var search_DESCRIPTION = document.getElementById('input_pathway_down_search_DESCRIPTION').value;
    var search_p_value = document.getElementById('input_pathway_down_search_p_value').value;
    var search_fdr = document.getElementById('input_pathway_down_search_fdr').value;
    var search_RATIO = document.getElementById('input_pathway_down_search_RATIO').value;
    var search_GENE_LIST = document.getElementById('input_pathway_down_search_GENE_LIST').value;
    var search_NUMBER_HITS = document.getElementById('input_pathway_down_search_NUMBER_HITS').value;
    var search_NUMBER_MISSES = document.getElementById('input_pathway_down_search_NUMBER_MISSES')
      .value;
    var search_NUMBER_USER_GENES = document.getElementById(
      'input_pathway_down_search_NUMBER_USER_GENES'
    ).value;
    var search_TOTAL_GENES_MINUS_INPUT = document.getElementById(
      'input_pathway_down_search_TOTAL_GENES_MINUS_INPUT'
    ).value;

    props.getPathwayDown({
      page_size: 25,
      page_number: 1,
      sorting: {
        name: 'P_Value',
        order: 'ascend',
      },
      search_keyword: {
        search_PATHWAY_ID: search_PATHWAY_ID,
        search_SOURCE: search_SOURCE,
        search_DESCRIPTION: search_DESCRIPTION,
        search_p_value: Number(search_p_value),
        search_fdr: Number(search_fdr),
        search_RATIO: search_RATIO,
        search_GENE_LIST: search_GENE_LIST,
        search_NUMBER_HITS: Number(search_NUMBER_HITS),
        search_NUMBER_MISSES: Number(search_NUMBER_MISSES),
        search_NUMBER_USER_GENES: Number(search_NUMBER_USER_GENES),
        search_TOTAL_GENES_MINUS_INPUT: Number(search_TOTAL_GENES_MINUS_INPUT),
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
      <Menu.Item key="1">Pathways for Downregulated Genes Table Results</Menu.Item>
      <Menu.Item key="2">Normalized Data</Menu.Item>
    </Menu>
  );

  content = (
    <div>
      {props.data.pathways_down.message && (
        <div>
          {' '}
          <p className="err-message" id="message-pdg">
            {props.data.pathways_down.message}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id="pathways-down-select" className="col" style={{ marginRight: 'auto' }}>
          <Dropdown overlay={menu}>
            <Button style={{ marginRight: '10px' }}>
              <span id="pd-drop-down">25</span> <Icon type="down" />
            </Button>
          </Dropdown>
          rows per page
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <span>
            Showing{' '}
            {1 +
              (props.data.pathways_down.pagination.current - 1) *
                props.data.pathways_down.pagination.pageSize}
            -
            {(props.data.pathways_down.pagination.current - 1) *
              props.data.pathways_down.pagination.pageSize +
              props.data.pathways_down.data.length}{' '}
            of {props.data.pathways_down.pagination.total} records
          </span>
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <Pagination
            {...props.data.pathways_down.pagination}
            onChange={(page, pageSize) =>
              props.getPathwayDown({
                page_size: pageSize,
                page_number: page,
                sorting: props.data.pathways_down.sorting,
                search_keyword: props.data.pathways_down.search_keyword,
              })
            }
          />
        </div>

        <div className="div-export-pathwayDown">
          <Dropdown overlay={ExportMenu}>
            <Button type="primary" id="btn-pathwayDown-export">
              <span id="pd-export-drop-down">Export</span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={props.data.pathways_down.data}
          pagination={false}
          loading={props.data.pathways_down.loading}
          scroll={{ x: 600 }}
        />
        {modal}
      </div>
    </div>
  );

  return content;
}
