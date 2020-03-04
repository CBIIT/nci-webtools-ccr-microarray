import React from 'react';
import { Checkbox, Input, Button } from 'antd';

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
                <option key={group} value={group}>
                  {group}
                </option>
              );
              options.unshift(d1);
              tmp_options.unshift(group);
            }
          });
        } else {
          if (gsm.groups) {
            var d2 = (
              <option key={gsm['groups']} value={gsm['groups']}>
                {gsm['groups']}
              </option>
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

  let button = '';
  if (
    props.data.group_1 != '-1' &&
    props.data.group_2 != '-1' &&
    props.data.group_1 != props.data.group_2
  ) {
    button = (
      <div style={{ padding: '8px 5px 10px 5px', margin: '10px' }}>
        <Button
          id="btn-run-contrast"
          className="ant-btn upload-start ant-btn-primary"
          onClick={props.runContrast}
        >
          <span>Run Contrast </span>
        </Button>
      </div>
    );
  } else {
    button = (
      <div style={{ padding: '8px 5px 10px 5px', margin: '10px' }}>
        <Button
          id="btn-run-contrast"
          className="ant-btn upload-start ant-btn-default"
          onClick={props.runContrast}
          disabled
        >
          <span>Run Contrast</span>
        </Button>
      </div>
    );
  }

  let group_1_content = (
    <select
      id="select-group-1"
      className="ant-select-selection ant-select-selection--single"
      value={props.data.group_1}
      style={{ width: '100%' }}
      onChange={props.handleGroup1Select}
    >
      <option value="-1">---select Group---</option>
      {options}
    </select>
  );
  let group_2_content = (
    <select
      id="select-group-2"
      className="ant-select-selection ant-select-selection--single"
      value={props.data.group_2}
      style={{ width: '100%' }}
      onChange={props.handleGroup2Select}
    >
      <option value="-1">---select Group---</option>
      {options}
    </select>
  );

  let normalization_option = (
    <select
      value={props.data.normal}
      id="select-normal"
      className="ant-select-selection ant-select-selection--single"
      style={{ width: '100%' }}
      value={props.data.normal}
      onChange={props.handleNormalSelect}
    >
      <option value="RMA">RMA</option>
      <option value="RMA_Loess">RMA plus Cyclic Loess</option>
    </select>
  );

  // define chip dropdown
  let chipOptions = '';
  let chipDropdown = '';
  if (props.data.multichip) {
    chipOptions = Object.keys(props.data.dataList).map((chip, i) => {
      return (
        <option key={i} value={chip}>
          {chip}
        </option>
      );
    });

    chipDropdown = (
      <div>
        <label className="title" htmlFor="selectChip">
          Chip: <span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
        </label>
        <select
          id="selectChip"
          aria-label="select chip"
          className="ant-select-selection ant-select-selection--single"
          value={props.data.chip}
          style={{ width: '100%' }}
          onChange={e => props.handleSelectChip(e)}
        >
          {chipOptions}
        </select>
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
