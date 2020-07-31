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
  Pagination,
} from 'antd';
import { Tooltip } from '../Tooltip/Tooltip';
import { TableHeader } from '../TableHeader/TableHeader';

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
    } else if (e.key == 2) {
      props.exportNormalAll();
    } else {
      props.exportNormalTSV();
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
    var importantStuff = window.open(
      window.location.origin + '/assets/loading.html',
      '_blank'
    );

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
          if (
            Object.keys(result.data).length == 0 ||
            result.data.constructor == Object
          ) {
            importantStuff.location.href =
              window.location.origin + '/assets/noheatmap.html';
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
          <TableHeader
            id="input_pathway_down_search_PATHWAY_ID"
            field="Pathway_ID"
            settings={props.data.pathways_down}
            searchKey="search_PATHWAY_ID"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.1 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.1
                  : minWidth,
            }}
          >
            <Tooltip title={'Heatmap for ' + text}>
              <a
                style={{ color: 'rgb(0, 0, 255)' }}
                onClick={() => showHeatMap({ index })}
              >
                <Icon type="area-chart" /> {text}
              </a>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="pathway_source_head">
          <TableHeader
            id="input_pathway_down_search_SOURCE"
            field="Source"
            settings={props.data.pathways_down}
            searchKey="search_SOURCE"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.09 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.09
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
        <div className="pathway_desc_head">
          <TableHeader
            id="input_pathway_down_search_DESCRIPTION"
            field="Description"
            settings={props.data.pathways_down}
            searchKey="search_DESCRIPTION"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
              document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                .offsetWidth *
                0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth * 0.1
                : minWidth,
          }}
        >
          <Tooltip title={text}>{text}</Tooltip>
        </div>
      ),
    },
    {
      title: (
        <div className="pathway_p_value_head">
          <TableHeader
            id="input_pathway_down_search_p_value"
            field="P_Value"
            settings={props.data.pathways_down}
            searchKey="search_p_value"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
            <Tooltip title={text}>
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
          <TableHeader
            id="input_pathway_down_search_fdr"
            field="FDR"
            settings={props.data.pathways_down}
            searchKey="search_fdr"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.07 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
                  : minWidth,
            }}
          >
            <Tooltip title={text}>
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
          <TableHeader
            id="input_pathway_down_search_RATIO"
            field="Ratio"
            settings={props.data.pathways_down}
            searchKey="search_RATIO"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.07 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
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
        <div className="pathway_number_hits_head">
          <TableHeader
            id="input_pathway_down_search_NUMBER_HITS"
            field="Number_Hits"
            settings={props.data.pathways_down}
            searchKey="search_NUMBER_HITS"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.07 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
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
        <div className="pathway_number_hits_head">
          <TableHeader
            id="input_pathway_down_search_NUMBER_MISSES"
            field="Number_Misses"
            settings={props.data.pathways_down}
            searchKey="search_NUMBER_MISSES"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.07 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
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
        <div className="pathway_number_user_genes_head">
          <TableHeader
            id="input_pathway_down_search_NUMBER_USER_GENES"
            field="Number_User_Genes"
            settings={props.data.pathways_down}
            searchKey="search_NUMBER_USER_GENES"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
                document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                  .offsetWidth *
                  0.07 >
                minWidth
                  ? document.getElementsByClassName(
                      'ant-tabs-tabpane-active'
                    )[0].offsetWidth * 0.07
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
        <div className="pathway_total_number_genes_head">
          <TableHeader
            id="input_pathway_down_search_TOTAL_GENES_MINUS_INPUT"
            field="Total_Genes_Minus_Input"
            settings={props.data.pathways_down}
            searchKey="search_TOTAL_GENES_MINUS_INPUT"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
        <div className="pathway_gene_list_head">
          <TableHeader
            id="input_pathway_up_search_GENE_LIST"
            field="Gene_List"
            settings={props.data.pathways_down}
            searchKey="search_GENE_LIST"
            searchFn={(key, val) => search(key, val)}
            sorter={(field, order) => sorter(field, order)}
          ></TableHeader>
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
              document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                .offsetWidth *
                0.1 >
              minWidth
                ? document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth * 0.1
                : minWidth,
          }}
        >
          <Tooltip title={text}>{text}</Tooltip>
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

  const search = (key, val) => {
    props.getPathwayDown({
      page_size: props.data.pathways_down.pagination.pageSize,
      page_number: 1,
      sorting: { ...props.data.pathways_down.sorting },
      search_keyword: {
        ...props.data.pathways_down.search_keyword,
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

  const ExportMenu = (
    <Menu onClick={handleExportMenuClick}>
      <Menu.Item key="1">
        Pathways for Downregulated Genes Table Results (.xlsx)
      </Menu.Item>
      <Menu.Item key="2">Normalized Data (.xlsx)</Menu.Item>
      <Menu.Item key="3">Normalized Data (.tsv)</Menu.Item>

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
        <div
          id="pathways-down-select"
          className="col"
          style={{ marginRight: 'auto' }}
        >
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
