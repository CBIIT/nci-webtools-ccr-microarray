import React from 'react';
import { Menu, Dropdown, Button, Icon, Table, Input, Pagination } from 'antd';
import { Tooltip } from '../Tooltip/Tooltip';
import { TableHeader } from '../TableHeader/TableHeader';

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
    } else if (e.key == 2) {
      props.exportNormalAll();
    } else {
      props.exportNormalTSV();
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
        <TableHeader
          id="input_deg_search_symbol"
          field="SYMBOL"
          settings={props.data.diff_expr_genes}
          searchKey="search_symbol"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.08 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.1
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
          id="input_deg_search_fc"
          field="FC"
          settings={props.data.diff_expr_genes}
          searchKey="search_fc"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.06 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip title={text}>{Number.parseFloat(text).toFixed(3)}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="input_deg_search_p_value"
          field="P.Value"
          settings={props.data.diff_expr_genes}
          searchKey="search_p_value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.08 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.1
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
        <TableHeader
          id="input_deg_search_adj_p_value"
          field="adj.P.val"
          settings={props.data.diff_expr_genes}
          searchKey="search_adj_p_value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.08 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.1
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
        <TableHeader
          id="input_deg_search_aveexpr"
          field="AveExpr"
          settings={props.data.diff_expr_genes}
          searchKey="search_aveexpr"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.08 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.08
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
          id="input_deg_search_input_deg_search_accnum"
          field="ACCNUM"
          settings={props.data.diff_expr_genes}
          searchKey="search_accnum"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.09 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.12
                  : minWidth + 50,
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
          id="input_deg_search_desc"
          field="DESC"
          settings={props.data.diff_expr_genes}
          searchKey="search_desc"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.15 >
                150
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.15
                  : 150,
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
          id="input_deg_search_entrez"
          field="ENTREZ"
          settings={props.data.diff_expr_genes}
          searchKey="search_entrez"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth *
                    0.1 >
                  minWidth
                    ? document.getElementsByClassName(
                        'ant-tabs-tabpane-active'
                      )[0].offsetWidth * 0.11
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
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth *
                    0.1 >
                  minWidth
                    ? document.getElementsByClassName(
                        'ant-tabs-tabpane-active'
                      )[0].offsetWidth * 0.11
                    : minWidth,
              }}
            >
              <Tooltip title={text}>{text}</Tooltip>
            </div>
          );
        }
      },
    },
    {
      title: (
        <TableHeader
          id="input_deg_search_probsetid"
          field="probsetID"
          settings={props.data.diff_expr_genes}
          searchKey="search_probsetid"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.08 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.08
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
          id="input_deg_search_t"
          field="t"
          settings={props.data.diff_expr_genes}
          searchKey="search_t"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.05 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.05
                  : minWidth,
            }}
          >
            <Tooltip title={text}>{Number.parseFloat(text)}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="input_deg_search_b"
          field="B"
          settings={props.data.diff_expr_genes}
          searchKey="search_b"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.05 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.05
                  : minWidth,
            }}
          >
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
  ];

  const search = (keyword, value) => {
    props.getDEG({
      page_size: props.data.diff_expr_genes.pagination.pageSize,
      page_number: 1,
      sorting: { ...props.data.diff_expr_genes.sorting },
      search_keyword: {
        ...props.data.diff_expr_genes.search_keyword,
        ...{ [keyword]: value },
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
      <Menu.Item key="1">DEG Table Results (.xlsx)</Menu.Item>
      <Menu.Item key="2">Normalized Data (.xlsx)</Menu.Item>
      <Menu.Item key="3">Normalized Data (.tsv)</Menu.Item>
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
