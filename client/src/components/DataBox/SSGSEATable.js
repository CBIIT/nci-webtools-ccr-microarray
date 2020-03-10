import React from 'react';
import { Menu, Dropdown, Button, Icon, Table, Input, Tooltip, Pagination } from 'antd';
const minWidth = 110;
const exponentialNum = 3;

export default function SSGSEATable(props) {
  function handleMenuClick(e) {
    document.getElementById('ss-drop-down').innerHTML = e.key;
    props.getssGSEA({
      page_size: parseInt(e.key),
      page_number: 1,
      sorting: {
        name: props.data.ssGSEA.sorting.name,
        order: props.data.ssGSEA.sorting.order
      },
      search_keyword: props.data.ssGSEA.search_keywordƒ
    });
  }

  function handleSelectionChange(event) {
    let value = event.target.value;
    if (value == 'ss_tag1') {
      props.updateCurrentWorkingObject('ssGSEA', 'ssSelect', value);
    }
    if (value == 'ss_tag2') {
      props.updateCurrentWorkingObject('pathwayHeatMap', 'ssSelect', value);
    }
  }

  function sorter(field, order) {
    if (!field) {
      field = 'P.Value';
    }

    if (!order) {
      order = 'ascend';
    }

    props.getssGSEA({
      page_size: props.data.ssGSEA.pagination.pageSize,
      page_number: props.data.ssGSEA.pagination.current,
      sorting: {
        name: field,
        order: order
      },
      search_keyword: props.data.ssGSEA.search_keyword
    });
  }

  let content = '';

  const columns = [
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor={'input_ssg_name'}>
            <span style={{ display: 'none' }}>input_ssg_name</span>
            <Input
              aria-label="input_ssg_name"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.name == ''
                  ? 'NAME'
                  : props.data.ssGSEA.search_keyword.name
              }
              id="input_ssg_name"
              defaultValue={props.data.ssGSEA.search_keyword.name}
            />
          </label>
          <div>
            <div className="head-title"> NAME</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'NAME' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('NAME', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'NAME' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('NAME', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'V1',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.25 >
                minWidth
                  ? document.getElementsByClassName('ant-tabs-tabpane-active')[0].offsetWidth * 0.25
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
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_ssg_search_logFC">
            <span style={{ display: 'none' }}>input_ssg_search_logFC</span>
            <Input
              aria-label="input_ssg_search_logFC"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_logFC == ''
                  ? 'logFC'
                  : props.data.ssGSEA.search_keyword.search_logFC
              }
              id="input_ssg_search_logFC"
            />
          </label>
          <div>
            <div className="head-title"> logFC</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'logFC' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('logFC', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'logFC' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('logFC', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'V2',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line">
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {Number.parseFloat(text).toFixed(3)}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_ssg_search_p_value">
            <span style={{ display: 'none' }}>input_ssg_search_p_value</span>
            <Input
              aria-label="input_ssg_search_p_value"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_p_value == ''
                  ? 'P.Value'
                  : props.data.ssGSEA.search_keyword.search_p_value
              }
              id="input_ssg_search_p_value"
            />
          </label>
          <div>
            <div className="head-title"> P.Value</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'P.Value' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.ssGSEA.sorting.name == 'P.Value' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      dataIndex: 'V5',
      sorter: false,
      width: '10%',
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div className="single-line" style={{ minWidth: '130px' }}>
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {Number.parseFloat(text).toExponential(exponentialNum)}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_ssg_search_adj_p_value">
            <span style={{ display: 'none' }}>input_ssg_search_adj_p_value</span>
            <Input
              aria-label="input_ssg_search_adj_p_value"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_adj_p_value == ''
                  ? 'adj.P.Value'
                  : props.data.ssGSEA.search_keyword.search_adj_p_value
              }
              id="input_ssg_search_adj_p_value"
            />
          </label>
          <div>
            <div className="head-title"> adj.P.Value</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'adj.P.Val' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.ssGSEA.sorting.name == 'adj.P.Val' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      dataIndex: 'V6',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line" style={{ minWidth: '130px' }}>
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {Number.parseFloat(text).toExponential(exponentialNum)}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center', width: '230px' }}>
          <label htmlFor="input_ssg_search_Avg_Enrichment_Score">
            <span style={{ display: 'none' }}>input_ssg_search_Avg_Enrichment_Score</span>
            <Input
              aria-label="input_ssg_search_Avg_Enrichment_Score"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_Avg_Enrichment_Score == ''
                  ? 'Avg.Enrichment.Score'
                  : props.data.ssGSEA.search_keyword.search_Avg_Enrichment_Score
              }
              id="input_ssg_search_Avg_Enrichment_Score"
            />
          </label>
          <div>
            <div className="head-title"> Avg.Enrichment.Score</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'Avg.Enrichment.Score' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Avg.Enrichment.Score', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'Avg.Enrichment.Score' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('Avg.Enrichment.Score', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'V3',
      sorter: false,
      width: '25%',
      render: (text, record, index) => {
        return (
          <div className="single-line" style={{ minWidth: '130px' }}>
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_ssg_search_t">
            <span style={{ display: 'none' }}>input_ssg_search_t</span>
            <Input
              aria-label="input_ssg_search_t"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_t == ''
                  ? 't'
                  : props.data.ssGSEA.search_keyword.search_t
              }
              id="input_ssg_search_t"
            />
          </label>
          <div>
            <div className="head-title"> t</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 't' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
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
                      props.data.ssGSEA.sorting.name == 't' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
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
      dataIndex: 'V4',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line">
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {Number.parseFloat(text)}
            </span>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="input_ssg_search_b">
            <span style={{ display: 'none' }}>input_ssg_search_b</span>
            <Input
              aria-label="input_ssg_search_b"
              onPressEnter={value => search(value)}
              placeholder={
                props.data.ssGSEA.search_keyword.search_b == ''
                  ? 'B'
                  : props.data.ssGSEA.search_keyword.search_b
              }
              id="input_ssg_search_b"
            />
          </label>
          <div>
            <div className="head-title">B</div>
            <div className="head-sorter">
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'B' &&
                      props.data.ssGSEA.sorting.order == 'ascend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('B', 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{
                    color:
                      props.data.ssGSEA.sorting.name == 'B' &&
                      props.data.ssGSEA.sorting.order == 'descend'
                        ? 'blue'
                        : '#ccc'
                  }}
                  onClick={() => sorter('B', 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      dataIndex: 'V7',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line">
            <span data-toggle="tooltip" data-placement="left" title={text}>
              {text}
            </span>
          </div>
        );
      }
    }
  ];

  function search(e) {
    var search_name = document.getElementById('input_ssg_name').value;
    var search_logFC = document.getElementById('input_ssg_search_logFC').value;
    var search_Avg_Enrichment_Score = document.getElementById(
      'input_ssg_search_Avg_Enrichment_Score'
    ).value;
    var search_t = document.getElementById('input_ssg_search_t').value;
    var search_p_value = document.getElementById('input_ssg_search_p_value').value;
    var search_adj_p_value = document.getElementById('input_ssg_search_adj_p_value').value;
    var search_b = document.getElementById('input_ssg_search_b').value;
    props.getssGSEA({
      page_size: 25,
      page_number: 1,
      sorting: {
        name: 'P.Value',
        order: 'ascend'
      },
      search_keyword: {
        name: search_name,
        search_logFC: Number(search_logFC),
        search_Avg_Enrichment_Score: Number(search_Avg_Enrichment_Score),
        search_t: Number(search_t),
        search_p_value: Number(search_p_value),
        search_adj_p_value: Number(search_adj_p_value),
        search_b: Number(search_b)
      }
    });
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="15">15</Menu.Item>
      <Menu.Item key="25">25</Menu.Item>
      <Menu.Item key="50">50</Menu.Item>
      <Menu.Item key="100">100</Menu.Item>
      <Menu.Item key="200">200</Menu.Item>
    </Menu>
  );
  let link = './images/' + props.data.projectID + props.data.geneHeatmap;
  let selection = [
    <div key="ss_genset_select" id={'ss_genset_select'}>
      {' '}
      <label key="ss_genset_select_label" htmlFor="ss_gene_set_select_option">
        <span>ssGSEA Gene Sets selection </span>
      </label>{' '}
      <select
        value={props.data.geneSelect}
        id="ss_gene_set_select_option"
        className="ant-select-selection ant-select-selection--single"
        onChange={e => props.handleGeneChange(e)}
        aria-label="Gene Set For ssGSEA"
      >
        <optgroup label="Human">
          <option value="human$H: Hallmark Gene Sets">H: Hallmark Gene Sets</option>
          <option value="human$C1: Positional Gene Sets">C1: Positional Gene Sets</option>
          <option value="human$C2: Curated Gene Sets">C2: Curated Gene Sets</option>
          <option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</option>
          <option value="human$C4: Computational Gene Sets">C4: Computational Gene Sets</option>
          <option value="human$C5: GO gene sets">C5: GO gene sets</option>
          <option value="human$C6: Oncogenic Signatures">C6: Oncogenic Signatures</option>
          <option value="human$C7: Immunologic Signatures">C7: Immunologic Signatures</option>
        </optgroup>
        <optgroup label="Mouse">
          <option value="mouse$Co-expression">Co-expression</option>
          <option value="mouse$Gene Ontology">Gene Ontology</option>
          <option value="mouse$Curated Pathway">Curated Pathway</option>
          <option value="mouse$Metabolic">Metabolic</option>
          <option value="mouse$TF targets">TF targets</option>
          <option value="mouse$miRNA targets">miRNA targets</option>
          <option value="mouse$Location">Location</option>
        </optgroup>
      </select>
    </div>
  ];
  let tabs = [
    <div
      key="ss_tag1"
      id="ss_tag1"
      className="ss_plot"
      style={{ display: props.data.ssSelect == 'ss_tag1' ? 'block' : 'none' }}
    >
      {props.data.ssGSEA.message && (
        <div>
          {' '}
          <p className="err-message" id="message-ssgsea">
            {props.data.ssGSEA.message}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id="ss-select" className="col" style={{ marginRight: 'auto' }}>
          <Dropdown overlay={menu}>
            <Button style={{ marginRight: '10px' }}>
              <span id="ss-drop-down">25</span> <Icon type="down" />
            </Button>
          </Dropdown>
          rows per page
        </div>

        <div className="col" style={{ marginRight: '1rem' }}>
          <span>
            Showing{' '}
            {1 + (props.data.ssGSEA.pagination.current - 1) * props.data.ssGSEA.pagination.pageSize}
            -
            {(props.data.ssGSEA.pagination.current - 1) * props.data.ssGSEA.pagination.pageSize +
              props.data.ssGSEA.data.length}{' '}
            of {props.data.ssGSEA.pagination.total} records
          </span>
        </div>

        <div className="col">
          <Pagination
            {...props.data.ssGSEA.pagination}
            onChange={(page, pageSize) =>
              props.getssGSEA({
                page_size: pageSize,
                page_number: page,
                sorting: props.data.ssGSEA.sorting,
                search_keyword: props.data.ssGSEA.search_keyword
              })
            }
          />
        </div>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={props.data.ssGSEA.data}
          pagination={false}
          loading={props.data.ssGSEA.loading}
          scroll={{ x: 600 }}
        />
      </div>
    </div>,
    <div
      key="ss_tag2"
      id="ss_tag2"
      className="ss_plot"
      style={{ display: props.data.ssSelect == 'ss_tag2' ? 'block' : 'none' }}
    >
      <br />
      <br />
      {props.data.geneHeatmap}
    </div>
  ];
  content = [
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '1rem' }}>
        <label key="label_ss_select_option" htmlFor="ss_select_option">
          <span>ssGSEA section selection </span>
        </label>
        <select
          value={props.data.ssSelect}
          key="ss_select_option"
          id="ss_select_option"
          className="ant-select-selection ant-select-selection--single"
          onChange={handleSelectionChange}
        >
          <option value="ss_tag1">Single Sample GSEA</option>
          <option value="ss_tag2">Pathway Heatmap</option>
        </select>
      </div>
      <div>{selection}</div>
      <div className="div-export-ss col" style={{ marginLeft: 'auto' }}>
        <Button id="btn-ss-export" type="primary" onClick={props.exportGSEA}>
          {' '}
          Export
        </Button>
      </div>
    </div>,
    tabs
  ];
  return content;
}
