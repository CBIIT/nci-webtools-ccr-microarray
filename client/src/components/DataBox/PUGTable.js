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
  // term: search keywords
  const [state, setState] = useState({
    term: '',
    heapMap: '',
    visible: false,
    table_content: '',
  });

  function handleMenuClick(e) {
    document.getElementById('pu-drop-down').innerHTML = e.key;
    props.getPathwayUp({
      page_size: parseInt(e.key),
      page_number: 1,
      sorting: {
        name: props.data.pathways_up.sorting.name,
        order: props.data.pathways_up.sorting.order,
      },
      search_keyword: props.data.pathways_up.search_keyword,
    });
  }

  function handleExportMenuClick(e) {
    if (e.key == 1) {
      props.exportPathwayUp();
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

    props.getPathwayUp({
      page_size: props.data.pathways_up.pagination.pageSize,
      page_number: props.data.pathways_up.pagination.current,
      sorting: {
        name: field,
        order: order,
      },
      search_keyword: props.data.pathways_up.search_keyword,
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
          message.warning('no rows to aggregate');
        }
      });
  }

  const { visible } = state;
  let content = '';

  const columns = [
    {
      title: (
        <TableHeader
          id="Pathway_Name"
          field="Pathway_Name"
          settings={props.data.pathways_up}
          searchKey="Pathway_Name"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Pathway_Name',
      width: 150,
      fixed: 'left',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Category"
          field="Category"
          settings={props.data.pathways_up}
          searchKey="Category"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Category',
      // width: '12%',
      sorter: false,
      render: (text, record, index) => (
        <div>
          <Tooltip title={text}>{text}</Tooltip>
        </div>
      ),
    },
    {
      title: (
        <TableHeader
          id="P_Value"
          field="P_Value"
          settings={props.data.pathways_up}
          searchKey="P_Value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'P_Value',
      //width: '8%',
      sorter: false,
      defaultSortOrder: 'ascend',
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>
              {Number.parseFloat(text) != 0
                ? Number.parseFloat(text).toExponential(exponentialNum)
                : Number.parseFloat(text)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Permutation_P-Value"
          field="Perm_P-Val"
          settings={props.data.pathways_up}
          searchKey="Permutation_P-Value"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Permutation_P-Value',
      //width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>
              {Number.parseFloat(text) != 0
                ? Number.parseFloat(text).toExponential(exponentialNum)
                : Number.parseFloat(text)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Enrichment_Score"
          field="Enrich_Score"
          tooltip="Enrichment_Score"
          settings={props.data.pathways_up}
          searchKey="Enrichment_Score"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Enrichment_Score',
      //width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{Number.parseFloat(text)}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Percent_Gene_Hits_per_Pathway"
          field="%_Genes"
          settings={props.data.pathways_up}
          searchKey="Percent_Gene_Hits_per_Pathway"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Percent_Gene_Hits_per_Pathway',
      //width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Significant_Genes_IN_Pathway"
          field="Sig_IN"
          settings={props.data.pathways_up}
          searchKey="Significant_Genes_IN_Pathway"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Significant_Genes_IN_Pathway',
      //width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Non-Significant_genes_IN_Pathway"
          field="Nonsig_IN"
          settings={props.data.pathways_up}
          searchKey="Non-Significant_genes_IN_Pathway"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Non-Significant_genes_IN_Pathway',
      //width: '8%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Significant_genes_NOT_IN_Pathway"
          field="Sig_NOT_IN"
          settings={props.data.pathways_up}
          searchKey="Significant_genes_NOT_IN_Pathway"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Significant_genes_NOT_IN_Pathway',
      //width: '12%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Non-Significant_Genes_NOT_IN_Pathway"
          field="Nonsig_NOT_IN"
          settings={props.data.pathways_up}
          searchKey="Non-Significant_Genes_NOT_IN_Pathway"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Non-Significant_Genes_NOT_IN_Pathway',
      //width: '12%',
      sorter: false,
      render: (text, record, index) => {
        return (
          <div>
            <Tooltip title={text}>{text}</Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <TableHeader
          id="Pathway_ID"
          field="Pathway_ID"
          settings={props.data.pathways_up}
          searchKey="Pathway_ID"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Pathway_ID',
      width: 120,
      sorter: false,
      className: 'table_th',
      render: (text, record, index) => {
        return (
          <div>
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
        <TableHeader
          id="Gene_List"
          field="Gene_List"
          settings={props.data.pathways_up}
          searchKey="search_GENE_LIST"
          searchFn={(key, val) => search(key, val)}
          sorter={(field, order) => sorter(field, order)}
        />
      ),
      dataIndex: 'Gene_List',
      width: 110,
      sorter: false,
      render: (text, record, index) => (
        <div>
          <Tooltip title={text}>{text}</Tooltip>
        </div>
      ),
    },
  ];

  const search = (key, val) => {
    props.getPathwayUp({
      page_size: props.data.pathways_up.pagination.pageSize,
      page_number: 1,
      sorting: { ...props.data.pathways_up.sorting },
      search_keyword: {
        ...props.data.pathways_up.search_keyword,
        ...{ [key]: val },
      },
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
        </Button>,
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
      <Menu.Item key="1">
        Pathways for Upregulated Genes Table Results (.xlsx)
      </Menu.Item>
      <Menu.Item key="2">Normalized Data (.xlsx)</Menu.Item>
      <Menu.Item key="3">Normalized Data (.tsv)</Menu.Item>
    </Menu>
  );

  content = (
    <div>
      {props.data.pathways_up.message && (
        <div>
          <p className="err-message" id="message-pug">
            {props.data.pathways_up.message + ''}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          id="pathways-up-select"
          className="col"
          style={{ marginRight: 'auto' }}
        >
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
                search_keyword: props.data.pathways_up.search_keyword,
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
          scroll={{ x: 1300 }}
        />
        {modal}
      </div>
    </div>
  );

  return content;
}
