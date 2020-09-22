import React from 'react';
import { Menu, Dropdown, Button, Icon, Table, Input, Pagination } from 'antd';
import { Tooltip } from '../Tooltip/Tooltip';
import { TableHeader } from '../TableHeader/TableHeader';

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
        order: props.data.ssGSEA.sorting.order,
      },
      search_keyword: props.data.ssGSEA.search_keyword,
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
        order: order,
      },
      search_keyword: props.data.ssGSEA.search_keyword,
    });
  }

  let content = '';

  const columns = [
    {
      title: (
        <TableHeader
          id="name"
          field="NAME"
          settings={props.data.ssGSEA}
          searchKey="name"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V1',
      sorter: false,
      width: '25%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              maxWidth:
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.25 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.25
                  : minWidth,
            }}
          >
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="logFC"
          field="logFC"
          h
          settings={props.data.ssGSEA}
          searchKey="search_logFC"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V2',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Tooltip title={text}>{Number.parseFloat(text).toFixed(3)}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="p_value"
          field="P.Value"
          settings={props.data.ssGSEA}
          searchKey="search_p_value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V5',
      sorter: false,
      width: '10%',
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              minWidth: '130px',
              display: 'flex',
              justifyContent: 'center',
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
        <TableHeader
          id="adj_p_value"
          field="adj.P.Value"
          settings={props.data.ssGSEA}
          searchKey="search_adj_p_value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V6',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              minWidth: '130px',
              display: 'flex',
              justifyContent: 'center',
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
        <TableHeader
          id="Avg_Enrichment_Score"
          field="Avg.Enrichment.Score"
          settings={props.data.ssGSEA}
          searchKey="search_Avg_Enrichment_Score"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V3',
      sorter: false,
      width: '25%',
      render: (text, record, index) => {
        return (
          <div
            className="single-line"
            style={{
              minWidth: '130px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="t"
          field="t"
          settings={props.data.ssGSEA}
          searchKey="search_t"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V4',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line">
            <Tooltip title={text}>{Number.parseFloat(text)}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="b"
          field="b"
          settings={props.data.ssGSEA}
          searchKey="search_b"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
      ),
      dataIndex: 'V7',
      sorter: false,
      width: '10%',
      render: (text, record, index) => {
        return (
          <div className="single-line">
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
  ];

  const search = (key, val) => {
    props.getssGSEA({
      page_size: props.data.ssGSEA.pagination.pageSize,
      page_number: 1,
      sorting: { ...props.data.ssGSEA.sorting },
      search_keyword: {
        ...props.data.ssGSEA.search_keyword,
        ...{ [key]: val },
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
        onChange={(e) => props.handleGeneChange(e)}
        aria-label="Gene Set For ssGSEA"
      >
        <optgroup label="Human">
          <option value="human$H: Hallmark Gene Sets">
            H: Hallmark Gene Sets
          </option>
          <option value="human$C1: Positional Gene Sets">
            C1: Positional Gene Sets
          </option>
          <option value="human$C2: Curated Gene Sets">
            C2: Curated Gene Sets
          </option>
          <option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</option>
          <option value="human$C4: Computational Gene Sets">
            C4: Computational Gene Sets
          </option>
          <option value="human$C5: GO gene sets">C5: GO gene sets</option>
          <option value="human$C6: Oncogenic Signatures">
            C6: Oncogenic Signatures
          </option>
          <option value="human$C7: Immunologic Signatures">
            C7: Immunologic Signatures
          </option>
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
    </div>,
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
            {1 +
              (props.data.ssGSEA.pagination.current - 1) *
                props.data.ssGSEA.pagination.pageSize}
            -
            {(props.data.ssGSEA.pagination.current - 1) *
              props.data.ssGSEA.pagination.pageSize +
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
                search_keyword: props.data.ssGSEA.search_keyword,
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
    </div>,
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
    tabs,
  ];
  return content;
}
