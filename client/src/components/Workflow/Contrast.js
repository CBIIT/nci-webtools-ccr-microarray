import React from 'react';
import { Checkbox, Input, Button, Tooltip, Select } from 'antd';
const { Option } = Select;

export default function Contrast(props) {
  function handleSwitchChange(e) {
    if (e.target.checked) {
      props.changeRunContrastMode(true);
    } else {
      props.changeRunContrastMode(false);
    }
  }

  let options = [];
  let tmp_options = [];
  // find the unique value in grups
  function findUnique(data) {
    data.filter(gsm => {
      if (tmp_options.indexOf(gsm['groups']) == -1 && gsm['groups'] != '') {
        // multi-group
        if (gsm['groups'] && gsm['groups'].indexOf(',') != -1) {
          let groups = gsm['groups'].split(',');
          groups.forEach(function(group) {
            if (tmp_options.indexOf(group) == -1 && group != '') {
              let d1 = (
                <Option key={group} value={group}>
                  {group}
                </Option>
              );
              options.unshift(d1);
              tmp_options.unshift(group);
            }
          });
        } else {
          if (gsm.groups) {
            var d2 = (
              <Option key={gsm['groups']} value={gsm['groups']}>
                {gsm['groups']}
              </Option>
            );
            options.unshift(d2);
            tmp_options.unshift(gsm['groups']);
          }
        }
      }
    });
  }

  if (props.data.multichip === true) {
    findUnique(props.data.dataList[props.data.chip]);
  } else {
    findUnique(props.data.dataList);
  }

  let queueBlock = (
    <div className="block ">
      <div id="checkbox_queue">
        {' '}
        <Checkbox checked={props.data.useQueue} onChange={handleSwitchChange}>
          Submit this job to a Queue
        </Checkbox>
      </div>
      <div className="queueMessage" style={{ paddingLeft: '23px' }}>
        (Jobs currently enqueued: {props.data.numberOfTasksInQueue})
      </div>
      <label className="title">
        {' '}
        Email<span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
      </label>
      <Input
        disabled={!props.data.useQueue}
        id="email"
        aria-label="input email"
        id="input-email"
        placeholder="email"
      />
      <span className="queueMessage">
        Note: if sending to queue, when computation is completed, a notification will be sent to the
        e-mail entered above.
      </span>
      <div>
        <span className="err-message" id="message-use-queue"></span>
      </div>
      <div>
        <span className="success-message" id="message-success-use-queue"></span>
      </div>
    </div>
  );

  let validContrast =
    props.data.group_1 != '-1' &&
    props.data.group_2 != '-1' &&
    props.data.group_1 != props.data.group_2;

  let button = '';

  button = (
    <div className="row" style={{ marginLeft: '-10px', marginRight: '0px' }}>
      <div className="col-sm-6">
        <Button
          id="btn-run-contrast"
          type={props.data.disableContrast ? 'default' : validContrast ? 'primary' : 'default'}
          onClick={props.runContrast}
          disabled={props.data.disableContrast ? true : validContrast ? false : true}
        >
          <span>Run Contrast </span>
        </Button>
      </div>
      <div className="col-sm-6">
        <Tooltip placement="right" title="Reset to start a new contrast analysis">
          <Button
            id="btnResetContrast"
            className="ant-btn upload-start ant-btn-primary"
            onClick={props.resetContrast}
          >
            <span>Reset</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  let group_1_content = (
    <Select
      id="select-group-1"
      value={props.data.group_1}
      style={{ width: '100%' }}
      onChange={props.handleGroup1Select}
      disabled={props.data.disableContrast}
    >
      <Option value="-1">---select Group---</Option>
      {options}
    </Select>
  );
  let group_2_content = (
    <Select
      id="select-group-2"
      value={props.data.group_2}
      style={{ width: '100%' }}
      onChange={props.handleGroup2Select}
      disabled={props.data.disableContrast}
    >
      <Option value="-1">---select Group---</Option>
      {options}
    </Select>
  );

  let normalization_option = (
    <Select
      value={props.data.normal}
      id="select-normal"
      style={{ width: '100%' }}
      value={props.data.normal}
      onChange={props.handleNormalSelect}
      disabled={props.data.disableContrast}
    >
      <Option value="RMA">RMA</Option>
      <Option value="RMA_Loess">RMA plus Cyclic Loess</Option>
    </Select>
  );

  // define chip dropdown
  let chipOptions = '';
  let chipDropdown = '';
  if (props.data.multichip) {
    chipOptions = Object.keys(props.data.dataList).map((chip, i) => {
      return (
        <Option key={i} value={chip}>
          {chip}
        </Option>
      );
    });

    chipDropdown = (
      <div>
        <label className="title" htmlFor="selectChip">
          Chip: <span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
        </label>
        <Select
          id="selectChip"
          aria-label="select chip"
          value={props.data.chip}
          style={{ width: '100%' }}
          onChange={props.handleSelectChip}
          disabled={props.data.disableContrast}
        >
          {chipOptions}
        </Select>
      </div>
    );
  }

  return (
    <div>
      <div className="block">
        {chipDropdown}
        <label className="title" htmlFor="select-group-1">
          Choose Contrast To Show: <span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
        </label>
        {group_1_content}
        <label className="title" htmlFor="select-group-2">
          VS: <span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
        </label>
        {group_2_content}
      </div>
      <div className="block ">
        <label className="title" htmlFor="select-normal">
          Choose Normalization Method:
          {normalization_option}
        </label>
      </div>
      {queueBlock}
      {button}
      <br />
    </div>
  );
}
