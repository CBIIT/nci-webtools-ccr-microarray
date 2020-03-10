import React, { useState } from 'react';
import {
  Menu,
  Dropdown,
  Icon,
  Table,
  Select,
  Input,
  message,
  Modal,
  Button,
  Tooltip,
  Pagination
} from 'antd';
const Search = Input.Search;
const minWidth = 110;

const exponentialNum = 3;

export default function PUGTable(props) {
  // term: search keywords
  const [state, setState] = useState({
    term: '',
    heapMap: '',
    visible: false,
    table_content: ''
  });

  function handleMenuClick(e) {
    document.getElementById('pu-drop-down').innerHTML = e.key;
    props.getPathwayUp({
      page_size: parseInt(e.key),
      page_number: 1,
      sorting: {
        name: props.data.pathways_up.sorting.name,
        order: props.data.pathways_up.sorting.order
      },
      search_keyword: props.data.pathways_up.search_keyword
    });
  }

  function handleExportMenuClick(e) {
    if (e.key == 1) {
      props.exportPathwayUp();
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

    props.getPathwayUp({
      page_size: props.data.pathways_up.pagination.pageSize,
      page_number: props.data.pathways_up.pagination.current,
      sorting: {
        name: field,
        order: order
      },
      search_keyword: props.data.pathways_up.search_keyword
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
    reqBody.upOrDown = 'upregulated_pathways';
    reqBody.pathway_name = props.data.pathways_up.data[idx.index].Description;
    props.changeLoadingStatus(true, 'loading HeatMap');

    var importantStuff = window.open(window.location.origin + '/assets/loading.html', '_blank');

    fetch('./api/analysis/pathwaysHeapMap', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
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
          message.warning('no rows to aggregate');
        }
      });
  }

  const { visible } = state;
  let content = '';

  const columns = [
    {
      title: (
        <div className="pathway_up_pathways_id_head">
          <label htmlFor="input_pathway_up_search_PATHWAY_ID">
            <span style={{ display: 'none' }}>input_pathway_up_search_PATHWAY_ID</span>
            <Input
              aria-label="input_pathway_up_search_PATHWAY_ID"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_PATHWAY_ID == ''
                  ? 'PATHWAY_ID'
                  : props.data.pathways_up.search_keyword.search_PATHWAY_ID
              }
              id="input_pathway_up_search_PATHWAY_ID"
            />
          </label>
          <div>
            <div className="head-title"> PATHWAY_ID</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Pathway_ID' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Pathway_ID' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      sorter: false,
      className: 'table_th',

      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_pathways_id"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.12 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth
            }}
          >
            <span
              style={{ color: 'rgb(0, 0, 255)' }}
              data-toggle="tooltip"
              data-placement="left"
              title={text}
            >
              <a style={{ color: 'rgb(0, 0, 255)' }} onClick={() => showHeatMap({ index })}>
                {text}
              </a>
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_source_head">
          <label htmlFor="input_pathway_up_search_SOURCE">
            <span style={{ display: 'none' }}>input_pathway_up_search_SOURCE</span>
            <Input
              aria-label="input_pathway_up_search_SOURCE"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_SOURCE == ''
                  ? 'SOURCE'
                  : props.data.pathways_up.search_keyword.search_SOURCE
              }
              id="input_pathway_up_search_SOURCE"
            />
          </label>
          <div>
            <div className="head-title"> SOURCE</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Source' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Source' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '9%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_source"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.09 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.09
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_desc_head">
          <label htmlFor="input_pathway_up_search_DESCRIPTION">
            <span style={{ display: 'none' }}>input_pathway_up_search_DESCRIPTION</span>
            <Input
              aria-label="input_pathway_up_search_DESCRIPTION"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_DESCRIPTION == ''
                  ? 'DESC'
                  : props.data.pathways_up.search_keyword.search_DESCRIPTION
              }
              id="input_pathway_up_search_DESCRIPTION"
            />
          </label>
          <div>
            <div className="head-title"> DESCRIPTION</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Description' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Description' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '10%',
      sorter: false,
      render: (text, record, index) => (
        <div
          className="single-line pathway_desc"
          style={{
            maxWidth:
              document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
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
      title: (
        <div className="pathway_up_type_head">
          <label htmlFor="input_pathway_up_search_TYPE">
            <span style={{ display: 'none' }}>input_pathway_up_search_TYPE</span>
            <Input
              aria-label="input_pathway_up_search_TYPE"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_TYPE == ''
                  ? 'TYPE'
                  : props.data.pathways_up.search_keyword.search_TYPE
              }
              id="input_pathway_up_search_TYPE"
            />
          </label>
          <div>
            <div className="head-title"> TYPE</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Type' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Type', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Type' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Type', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Type',
      width: '10%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_type"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_p_value_head">
          <label htmlFor="input_pathway_up_search_p_value">
            <span style={{ display: 'none' }}>input_pathway_up_search_p_value</span>
            <Input
              aria-label="input_pathway_up_search_p_value"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_p_value == ''
                  ? 'P_Value'
                  : props.data.pathways_up.search_keyword.search_p_value
              }
              id="input_pathway_up_search_p_value"
            />
          </label>
          <div>
            <div className="head-title"> P_VALUE</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'P_Value' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'P_Value' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      sorter: false,
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_p_value"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {Number.parseFloat(text).toExponential(exponentialNum)}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_fdr_head">
          <label htmlFor="input_pathway_up_search_fdr">
            <span style={{ display: 'none' }}>input_pathway_up_search_fdr</span>
            <Input
              aria-label="input_pathway_up_search_fdr"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_fdr == ''
                  ? 'FDR'
                  : props.data.pathways_up.search_keyword.search_fdr
              }
              id="input_pathway_up_search_fdr"
            />
          </label>
          <div>
            <div className="head-title"> FDR</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'FDR' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'FDR' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '7%',
      sorter: false,
      render: (text, record, index) => {
        text = Number.parseFloat(text).toExponential(exponentialNum);
        return (
          <div
            className="single-line pathway_fdr"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_ratio_head">
          <label htmlFor="input_pathway_up_search_RATIO">
            <span style={{ display: 'none' }}>input_pathway_up_search_RATIO</span>
            <Input
              aria-label="input_pathway_up_search_RATIO"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_RATIO == ''
                  ? 'RATIO'
                  : props.data.pathways_up.search_keyword.search_RATIO
              }
              id="input_pathway_up_search_RATIO"
            />
          </label>
          <div>
            <div className="head-title"> RATIO</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Ratio' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Ratio' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '7%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_ratio"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_gene_list_head">
          <label htmlFor="input_pathway_up_search_GENE_LIST">
            <span style={{ display: 'none' }}>input_pathway_up_search_GENE_LIST</span>
            <Input
              aria-label="input_pathway_up_search_GENE_LIST"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_GENE_LIST == ''
                  ? 'GENE_LIST'
                  : props.data.pathways_up.search_keyword.search_GENE_LIST
              }
              id="input_pathway_up_search_GENE_LIST"
            />
          </label>
          <div>
            <div className="head-title"> GENE_LIST</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'GENE_LIST' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'GENE_LIST' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      sorter: false,
      render: (text, record, index) => (
        <div
          className="single-line pathway_gene_list"
          style={{
            maxWidth:
              document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.1
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
      title: (
        <div className="pathway_up_number_hits_head">
          <label htmlFor="input_pathway_up_search_NUMBER_HITS">
            <span style={{ display: 'none' }}>input_pathway_up_search_NUMBER_HITS</span>
            <Input
              aria-label="input_pathway_up_search_NUMBER_HITS"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_NUMBER_HITS == ''
                  ? 'HITS'
                  : props.data.pathways_up.search_keyword.search_NUMBER_HITS
              }
              id="input_pathway_up_search_NUMBER_HITS"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_HITS</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Number_Hits' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Number_Hits' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '7%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_number_hits"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_number_genes_pathway_head">
          <label htmlFor="input_pathway_up_search_NUMBER_GENES_PATHWAY">
            <span style={{ display: 'none' }}>input_pathway_up_search_NUMBER_GENES_PATHWAY</span>
            <Input
              aria-label="input_pathway_up_search_NUMBER_GENES_PATHWAY"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_NUMBER_GENES_PATHWAY == ''
                  ? 'GENES_PATHWAY'
                  : props.data.pathways_up.search_keyword.search_NUMBER_GENES_PATHWAY
              }
              id="input_pathway_up_search_NUMBER_GENES_PATHWAY"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_GENES_PATHWAY</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Number_Genes_Pathway' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Number_Genes_Pathway', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Number_Genes_Pathway' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Number_Genes_Pathway', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Number_Genes_Pathway',
      width: '7%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_number_genes_pathway"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_number_user_genes_head">
          <label htmlFor="input_pathway_up_search_NUMBER_USER_GENES">
            <span style={{ display: 'none' }}>input_pathway_up_search_NUMBER_USER_GENES</span>
            <Input
              aria-label="input_pathway_up_search_NUMBER_USER_GENES"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.pathways_up.search_keyword.search_NUMBER_USER_GENES == ''
                  ? 'USER_GENES'
                  : props.data.pathways_up.search_keyword.search_NUMBER_USER_GENES
              }
              id="input_pathway_up_search_NUMBER_USER_GENES"
            />
          </label>
          <div>
            <div className="head-title"> NUMBER_USER_GENES</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Number_User_Genes' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.pathways_up.sorting.name == 'Number_User_Genes' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      width: '7%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_number_user_genes"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.07
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div className="pathway_up_total_number_genes_head">
          <label htmlFor="input_pathway_up_search_TOTAL_NUMBER_GENES">
            <span style={{ display: 'none' }}>input_pathway_up_search_TOTAL_NUMBER_GENES</span>
            <Input
              aria-label="input_pathway_up_search_TOTAL_NUMBER_GENES"
              onPressEnter={value => search(value)}
              placeholder="GENES"
              placeholder={
                props.data.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES == ''
                  ? 'GENES'
                  : props.data.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES
              }
              id="input_pathway_up_search_TOTAL_NUMBER_GENES"
            />
          </label>
          <div>
            <div className="head-title"> TOTAL_NUMBER_GENES</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Total_Number_Genes' &&
                      props.data.pathways_up.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Total_Number_Genes', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.pathways_up.sorting.name == 'Total_Number_Genes' &&
                      props.data.pathways_up.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Total_Number_Genes', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'Total_Number_Genes',
      width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div
            className="single-line pathway_total_number_genes"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.08
                  : minWidth
            }}
          >
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    }
  ];

  const search = e => {
    var search_PATHWAY_ID = document.getElementById('input_pathway_up_search_PATHWAY_ID').value;
    var search_SOURCE = document.getElementById('input_pathway_up_search_SOURCE').value;
    var search_DESCRIPTION = document.getElementById('input_pathway_up_search_DESCRIPTION').value;
    var search_TYPE = document.getElementById('input_pathway_up_search_TYPE').value;
    var search_p_value = document.getElementById('input_pathway_up_search_p_value').value;
    var search_fdr = document.getElementById('input_pathway_up_search_fdr').value;
    var search_RATIO = document.getElementById('input_pathway_up_search_RATIO').value;
    var search_GENE_LIST = document.getElementById('input_pathway_up_search_GENE_LIST').value;
    var search_NUMBER_HITS = document.getElementById('input_pathway_up_search_NUMBER_HITS').value;
    var search_NUMBER_GENES_PATHWAY = document.getElementById(
      'input_pathway_up_search_NUMBER_GENES_PATHWAY'
    ).value;
    var search_NUMBER_USER_GENES = document.getElementById(
      'input_pathway_up_search_NUMBER_USER_GENES'
    ).value;
    var search_TOTAL_NUMBER_GENES = document.getElementById(
      'input_pathway_up_search_TOTAL_NUMBER_GENES'
    ).value;

    props.getPathwayUp({
      page_size: 25,
      page_number: 1,
      sorting: {
        name: 'P_Value',
        order: 'ascend'
      },
      search_keyword: {
        search_PATHWAY_ID: search_PATHWAY_ID,
        search_SOURCE: search_SOURCE,
        search_DESCRIPTION: search_DESCRIPTION,
        search_TYPE: search_TYPE,
        search_p_value: Number(search_p_value),
        search_fdr: Number(search_fdr),
        search_RATIO: Number(search_RATIO),
        search_GENE_LIST: search_GENE_LIST,
        search_NUMBER_HITS: Number(search_NUMBER_HITS),
        search_NUMBER_GENES_PATHWAY: Number(search_NUMBER_GENES_PATHWAY),
        search_NUMBER_USER_GENES: Number(search_NUMBER_USER_GENES),
        search_TOTAL_NUMBER_GENES: Number(search_TOTAL_NUMBER_GENES)
      }
    });
  };

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
        </Button>
      ]}
    >
      <img src={state.heapMap} style={{ width: '100%' }} alt="heatMap" />
    </Modal>
  );
  // end  group modal

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
      <Menu.Item key="1">Pathways for Upregulated Genes Table Results</Menu.Item>
      <Menu.Item key="2">Normalized Data</Menu.Item>
    </Menu>
  );

  content = (
    <div>
      {props.data.pathways_up.message && (
        <div>
          {' '}
          <p className="err-message" id="message-pug">
            {props.data.pathways_up.message}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id="pathways-up-select" className="col" style={{ marginRight: 'auto' }}>
          <Dropdown overlay={menu}>
            <Button style={{ marginRight: '10px' }}>
              <span id="pu-drop-down">25</span> <Icon type="down" />
            </Button>
          </Dropdown>
          rows per page
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <span>
            Showing{' '}
            {1 +
              (props.data.pathways_up.pagination.current - 1) *
                props.data.pathways_up.pagination.pageSize}
            -
            {(props.data.pathways_up.pagination.current - 1) *
              props.data.pathways_up.pagination.pageSize +
              props.data.pathways_up.data.length}{' '}
            of {props.data.pathways_up.pagination.total} records
          </span>
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <Pagination
            {...props.data.pathways_up.pagination}
            onChange={(page, pageSize) =>
              props.getPathwayUp({
                page_size: pageSize,
                page_number: page,
                sorting: props.data.pathways_up.sorting,
                search_keyword: props.data.pathways_up.search_keyword
              })
            }
          />
        </div>

        <div className="div-export-pathwayUp col">
          <Dropdown overlay={ExportMenu}>
            <Button id="btn-pathwayUp-export" type="primary">
              <span id="pu-export-drop-down">Export</span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={props.data.pathways_up.data}
          pagination={false}
          loading={props.data.pathways_up.loading}
          scroll={{ x: 600 }}
        />
        {modal}
      </div>
    </div>
  );

  return content;
}
