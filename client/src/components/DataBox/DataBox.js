import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Table, Button, Input, Modal, message, Upload, Icon } from 'antd';
import Papa from 'papaparse';
import DEGBox from './DEGBox';
import GSMData from './GSMData';
import PrePlotsBox from './PrePlotsBox';
import PostPlotsBox from './PostPlotsBox';
import SSGSEATable from './SSGSEATable';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

export default function DataBox(props) {
  const [state, setState] = useState({
    groupVisible: false,
    groupName: '',
    groupMessage: '',
    selected: [],
    added: false,
    dataList: props.data.multichip
      ? props.data.dataListChip
      : props.data.dataList,
  });
  const [modalOption, setOption] = useState('group');
  const {
    groupVisible,
    groupName,
    groupMessage,
    selected,
    added,
    dataList,
  } = state;

  const child = useRef(null);

  function mergeState(obj) {
    setState({ ...state, ...obj });
  }

  useEffect(() => {
    mergeState({
      dataList: props.data.multichip
        ? props.data.dataListChip
        : props.data.dataList,
    });
  }, [props.data.dataList]);

  useEffect(() => {
    mergeState({
      dataList: props.data.dataListChip,
    });
  }, [props.data.dataListChip]);

  function groupOnChange(e) {
    mergeState({ groupName: e.target.value });
  }

  function handleCSV(e) {
    if (e.file.status === 'done') {
      Papa.parse(e.file.originFileObj, {
        config: {
          header: false,
        },
        complete: (results) => {
          let data = results.data;
          let assign = props.uploadGroup(data);
          assign === true
            ? mergeState({ added: false })
            : message.error(assign);
        },
      });
    } else if (e.file.status === 'error') {
      message.error(`${e.file.name} file upload failed.`);
    }
  }

  function handleTabChange(key) {
    if (key == 'Pre-normalization_QC_Plots') {
      let type = props.data.tag_pre_plot_status;
      switch (type) {
        case '':
          if (props.data.preplots.histplotBN == '') {
            props.getHistplotBN();
          }
          break;
        case 'getHistplotBN':
          if (props.data.preplots.histplotBN == '') {
            props.getHistplotBN();
          }
          break;
        // case 'getMAplotsBN':
        //   if (props.data.preplots.list_mAplotBN == '') {
        //     props.getMAplotsBN();
        //   }
        //   break;
        // case 'getBoxplotBN':
        //   if (props.data.preplots.Boxplots == '') {
        //     props.getBoxplotBN();
        //   }
        //   break;
        // case 'getRLE':
        //   if (props.data.preplots.RLE == '') {
        //     props.getRLE();
        //   }
        //   break;
        // case 'getNUSE':
        //   if (props.data.preplots.NUSE == '') {
        //     props.getNUSE();
        //   }
        //   break;
        default:
          if (props.data.preplots.histplotBN == '') {
            props.getHistplotBN();
          }
      }
    }
    if (key == 'Post-normalization_Plots') {
      let type = props.data.tag_post_plot_status;
      switch (type) {
        case '':
          if (props.data.postplot.histplotAN == '') {
            props.getHistplotAN();
          }
          break;
        case 'getHistplotAN':
          if (props.data.postplot.histplotAN == '') {
            props.getHistplotAN();
          }
          break;
        // case 'getBoxplotAN':
        //   if (props.data.postplot.Boxplots == '') {
        //     props.getBoxplotAN();
        //   }
        //   break;
        // case 'getPCA':
        //   if (props.data.postplot.PCA == '') {
        //     props.getPCA();
        //   }
        //   break;
        // case 'getHeatmapolt':
        //   if (props.data.postplot.Heatmapolt == '') {
        //     props.getHeatmapolt();
        //   }
        //   break;

        // case 'getMAplotAN':
        //   if (props.data.postplot.list_mAplotAN == '') {
        //     props.getMAplotAN();
        //   }
        //   break;
        default:
          if (props.data.postplot.histplotAN == '') {
            props.getHistplotAN();
          }
      }
    }

    if (key == 'DEG-Enrichments_Results') {
      let type = props.data.tag_deg_plot_status;
      switch (type) {
        case '':
          if (props.data.diff_expr_genes.data.length == 0) {
            props.getDEG();
          }
          break;
        // case 'pathways_up':
        //   if (props.data.pathways_up.data.length == 0) {
        //     props.getPathwayUp();
        //   }
        //   break;
        // case 'pathways_down':
        //   if (props.data.pathways_down.data.length == 0) {
        //     props.getPathwayDown();
        //   }
        //   break;
        case 'deg':
          if (props.data.diff_expr_genes.data.length == 0) {
            props.getDEG();
          }
          break;

        default:
          if (props.data.diff_expr_genes.data.length == 0) {
            props.getDEG();
          }
      }
    }
    if (key == 'GSM_1') {
      // do nothing
    }
    if (key == 'ssGSEA_Results') {
      if (props.data.ssGSEA.data.length == 0) {
        props.getssGSEA();
      }
    }
    props.updateCurrentWorkingTab(key);
  }

  function selection(selectedRowKeys) {
    mergeState({ selected: selectedRowKeys });
  }

  function createTag() {
    let name = groupName;

    if (name === '') {
      mergeState({ groupMessage: 'tag name is required.' });
    } else {
      if (selected.length > 0) {
        // if user select records in table
        props.assignGroup(modalOption, name, selected, function (flag) {
          if (flag) {
            mergeState({ added: true, groupMessage: '' });
          } else {
            let msg =
              'The group name only allows ASCII or numbers or underscore and it cannot start with numbers. Valid Group Name Example : RNA_1 ';
            mergeState({
              groupMessage: msg,
            });
          }
        });
      } else {
        mergeState({
          groupMessage: 'Please select some gsm(s).',
        });
      }
    }
  }

  function deleteTag(event, type) {
    var groupName = event.target.parentNode.parentNode.getElementsByTagName(
      'td'
    )[0].innerText;
    if (!groupName) {
      mergeState({
        groupMessage: 'No group selected for deleting.',
      });
    } else {
      props.deleteGroup(groupName.trim(), type);
    }
  }

  function handleOk() {
    setTimeout(() => mergeState({ visible: false }), 3000);
  }

  function handleCancel() {
    mergeState({
      group: '',
      groupName: '',
      groupMessage: '',
      groupVisible: false,
      added: false,
      selected: state.added === true ? [] : state.selected,
    });
    if (added) child.current.unselect();
  }

  function showModal() {
    mergeState({ groupVisible: true, groupName: '' });
  }

  let prePlotsBox = '';
  let postPlotsBox = '';
  let degBox = '';
  let ssGSEABox = '';
  let define_group_click_btn = '';
  const uploadOptions = () => {
    return {
      accept: '.csv',
      onChange: (e) => handleCSV(e),
      showUploadList: false,
      customRequest: ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess('ok');
        }, 0);
      },
    };
  };

  // define group btn
  if (dataList && dataList.length > 0) {
    define_group_click_btn = (
      <div className="row" style={{ display: 'flex' }}>
        <div className="div-group-gsm">
          <Button type="primary" onClick={() => showModal()}>
            Manage Groups/Batches
          </Button>{' '}
        </div>
        <div className="div-export-gsm">
          <Button
            id="btn-project-export"
            type="primary"
            onClick={props.exportGSE}
          >
            {' '}
            Export
          </Button>{' '}
        </div>
      </div>
    );
  }

  if (props.data.compared) {
    // controll display fo tags[preplot,postplot,DEG]
    prePlotsBox = (
      <TabPane
        tab="Pre-Normalization QC Plots"
        key="Pre-normalization_QC_Plots"
      >
        <PrePlotsBox
          key="prePlotsBox"
          getHistplotBN={props.getHistplotBN}
          getMAplotsBN={props.getMAplotsBN}
          getBoxplotBN={props.getBoxplotBN}
          getRLE={props.getRLE}
          getNUSE={props.getNUSE}
          data={props.data}
          updateCurrentWorkingObject={props.updateCurrentWorkingObject}
        />
      </TabPane>
    );
    postPlotsBox = (
      <TabPane tab="Post-Normalization Plots" key="Post-normalization_Plots">
        <PostPlotsBox
          key="postPlotsBox"
          getBoxplotAN={props.getBoxplotAN}
          getMAplotAN={props.getMAplotAN}
          getHistplotAN={props.getHistplotAN}
          getPCA={props.getPCA}
          getHeatmapolt={props.getHeatmapolt}
          data={props.data}
          updateCurrentWorkingObject={props.updateCurrentWorkingObject}
        />
      </TabPane>
    );
    degBox = (
      <TabPane tab="DEG-Enrichments Results" key="DEG-Enrichments_Results">
        <DEGBox
          key="degBox"
          data={props.data}
          exportNormalAll={props.exportNormalAll}
          exportNormalTSV={props.exportNormalTSV}
          changeLoadingStatus={props.changeLoadingStatus}
          getDEG={props.getDEG}
          getPathwayUp={props.getPathwayUp}
          getPathwayDown={props.getPathwayDown}
          getVolcanoPlot={props.getVolcanoPlot}
          exportPathwayUp={props.exportPathwayUp}
          exportPathwayDown={props.exportPathwayDown}
          exportDEG={props.exportDEG}
          updateCurrentWorkingObject={props.updateCurrentWorkingObject}
        />
      </TabPane>
    );
  } else {
    // controll display fo tags[preplot,postplot,DEG]
    prePlotsBox = (
      <TabPane
        tab="Pre-Normalization QC Plots"
        disabled
        key="Pre-normalization_QC_Plots"
      >
        {' '}
      </TabPane>
    );
    postPlotsBox = (
      <TabPane
        tab="Post-Normalization Plots"
        disabled
        key="Post-normalization_Plots"
      ></TabPane>
    );
    degBox = (
      <TabPane
        tab="DEG-Enrichments Results"
        disabled
        key="DEG-Enrichments_Results"
      ></TabPane>
    );
    ssGSEABox = (
      <TabPane tab="ssGSEA Results" disabled key="ssGSEA_Results"></TabPane>
    );
  }
  // control tab  SSGSEA
  if (props.data.done_gsea) {
    ssGSEABox = (
      <TabPane key="ssGSEA_Results" tab="ssGSEA Results">
        <SSGSEATable
          key="ssGSEA_Results_sstab_table"
          exportGSEA={props.exportGSEA}
          getssGSEA={props.getssGSEA}
          handleGeneChange={props.handleGeneChange}
          data={props.data}
          updateCurrentWorkingObject={props.updateCurrentWorkingObject}
        />
      </TabPane>
    );
  }

  var selected_gsms = '';
  let number_select = 0;
  if (dataList && dataList.length > 0) {
    for (var key in selected) {
      number_select = number_select + 1;
      selected_gsms = selected_gsms + dataList[selected[key] - 1].gsm + ',';
    }
  }

  // define group list in the modal
  const columns = (type) => {
    return [
      {
        title: type === 'group' ? 'GROUP' : 'BATCH',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      { title: 'GMS(s)', dataIndex: 'gsms', key: 'gsms' },
      {
        title: 'ACTION',
        dataIndex: 'name',
        key: 'key',
        width: 90,
        render: (e) => <a onClick={(e) => deleteTag(e, type)}>Delete</a>,
      },
    ];
  };

  // get group and gsm(s)  [{grupa: gsm1,gsm2,gsm3}]
  var groups_data = new Map();
  let batchData = new Map();

  for (let gsm of dataList) {
    if (gsm.groups) {
      // A sample belongs to multi-group
      for (let group of gsm.groups.split(',')) {
        if (groups_data.has(group)) {
          groups_data.set(group, groups_data.get(group) + ',' + gsm.gsm);
        } else {
          groups_data.set(group, gsm.gsm);
        }
      }
    }
    if (gsm.batch) {
      if (batchData.has(gsm.batch)) {
        batchData.set(gsm.batch, batchData.get(gsm.batch) + ',' + gsm.gsm);
      } else {
        batchData.set(gsm.batch, gsm.gsm);
      }
    }
  }

  var groups_data_list = [];
  groups_data.forEach((value, key) => {
    groups_data_list.push({ key: key, name: key, gsms: value });
  });

  let batchDataList = [];
  batchData.forEach((value, key) => {
    if (key != 'Others')
      batchDataList.push({ key: key, name: key, gsms: value });
  });

  let group_table = (
    <Table
      columns={columns('group')}
      scroll={{ x: 600 }}
      dataSource={groups_data_list}
      pagination={false}
    />
  );

  let batchTable = (
    <Table
      columns={columns('batch')}
      scroll={{ x: 600 }}
      dataSource={batchDataList}
      pagination={false}
    />
  );

  let modal = '';
  // define group modal
  modal = (
    <Modal
      width={'100%'}
      key="group_define_modal"
      visible={groupVisible}
      className="custom_modal"
      title="Manage GSM Group(s)/Batch(es)"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" type="primary" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      <div className="row">
        <label className="text-nowrap col-xs-12 col-sm-2">
          <input
            type="radio"
            aria-label="add group"
            value="addGroup"
            checked={modalOption === 'group'}
            onChange={() => setOption('group')}
          ></input>{' '}
          Add Group
        </label>
        <label className="text-nowrap col-xs-12 col-sm-2">
          <input
            type="radio"
            aria-label="add batch"
            value="addBatch"
            checked={modalOption === 'batch'}
            onChange={() => setOption('batch')}
          ></input>{' '}
          Add Batch
        </label>
        <label className="text-nowrap col-xs-12 col-sm-4">
          <input
            type="radio"
            aria-label="enable csv upload"
            value="upload"
            checked={modalOption === 'upload'}
            onChange={() => setOption('upload')}
          ></input>{' '}
          Add Group/Batch from file
        </label>
        <label className="col-xs-12 col-sm-4">
          <Upload {...uploadOptions()}>
            <Button type="default" disabled={modalOption != 'upload'}>
              <Icon type="upload" />
              Select File (.csv)
            </Button>
          </Upload>
        </label>
        <label className="col-xs-12 col-sm-3 col-sm-offset-8" style={{}}>
          <Button
            type="link"
            href="./assets/sample/GSMGroupsBatches-sample.csv"
            style={{ color: '#005ea2' }}
          >
            <Icon type="download" />
            Download Sample
          </Button>
        </label>
      </div>
      <div
        style={{
          display: added || modalOption === 'upload' ? 'none' : 'block',
        }}
      >
        <p style={{ color: '#215a82' }}>
          <b>
            <label htmlFor="textArea-group-selected">
              {number_select} Selected GSM(s)
            </label>
          </b>
        </p>
        <p
          style={{
            display:
              selected_gsms == '' && groupVisible == true ? 'block' : 'none',
          }}
          className="err-message"
          id="message-unselect-gsm-group"
        >
          Please select some gsm(s) before add gsm(s) as a group{' '}
        </p>
        <p>
          {' '}
          <TextArea
            id="textArea-group-selected"
            autoSize={false}
            disabled
            style={{ width: '100%', color: 'black' }}
            value={selected_gsms}
          />
        </p>
        <p style={{ color: '#215a82' }}>
          <b>
            Name<span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
          </b>{' '}
        </p>
        <p className="err-message" id="message-gsm-group">
          {groupMessage}
        </p>
        <p>
          <label htmlFor="input-define-group">
            <span style={{ display: 'none' }}>Define Group</span>
            <input
              type="text"
              value={groupName}
              id="input-define-group"
              disabled={selected == '' ? true : false}
              aria-label="define group name"
              className={
                selected == '' ? 'ant-input ant-input-disabled' : 'ant-input '
              }
              placeholder={'Name (Must start with an ASCII letter,a-z or A-Z)'}
              id={'input_groupName'}
              style={{
                width: 'calc(100% - 68px)',
                color: 'black',
                fontSize: '16px',
              }}
              onChange={(e) => groupOnChange(e)}
            />
            &nbsp;
            <Button
              type={selected == '' || groupName == '' ? 'default' : 'primary'}
              disabled={selected == '' || groupName == '' ? true : false}
              onClick={() => createTag(modalOption)}
            >
              Add
            </Button>
          </label>
        </p>
      </div>
      <p>
        <b style={{ color: '#215a82' }}>Saved Group(s)</b>{' '}
      </p>
      <p className="err-message" id="message-gsm-group-table"></p>
      {group_table}{' '}
      <p>
        <b style={{ color: '#215a82' }}>Saved Batch(es)</b>{' '}
      </p>
      <p className="err-message" id="message-gsm-group-table"></p>
      {batchTable}
    </Modal>
  );

  let content = (
    <Tabs
      onChange={handleTabChange}
      type="card"
      activeKey={props.data.tab_activeKey}
    >
      <TabPane tab="GSM Data" key="GSM_1">
        {define_group_click_btn}
        <GSMData
          ref={child}
          data={props.data}
          dataList={dataList}
          selected={selection}
        />
      </TabPane>
      {prePlotsBox}
      {postPlotsBox}
      {degBox}
      {ssGSEABox}
    </Tabs>
  );
  return (
    <div className="container-board-right">
      {content}
      {modal}
    </div>
  );
}
