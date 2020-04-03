import React, { useEffect, useRef } from 'react';
import { Input, Upload, Button, Icon, Tooltip, Select } from 'antd';
const { Option } = Select;

export default function Project(props) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      fix508();
    } else didMountRef.current = true;
  });

  function fix508() {
    const type = document.querySelector(
      '#analysisType_selection > .ant-select-selection.ant-select-selection--single'
    );
    const typeOption = document.querySelector(
      '#analysisType_selection > .ant-select-selection.ant-select-selection--single > .ant-select-selection__rendered'
    );

    type.setAttribute('aria-label', 'Select Analyis Type');
    type.removeAttribute('aria-autocomplete');
    typeOption.setAttribute('role', 'option');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      props.loadGSE();
    }
  }

  const { uploading } = props.data;
  const properties = {
    accept: '.gz,.cel,.CEL,.gz',
    action: '-',
    onRemove: file => {
      props.fileRemove(file);
    },
    beforeUpload: (file, fl) => {
      props.beforeUpload(fl);
      return false;
    },
    multiple: true,
    fileList: props.data.fileList
  };

  let type_content = (
    <div className="row">
      {' '}
      <div className="col-sm-12">
        <Select
          disabled={Object.keys(props.data.dataList).length != 0}
          id="analysisType_selection"
          value={props.data.analysisType}
          style={{ width: '100%' }}
          onChange={props.handleSelectType}
          role="listbox"
        >
          <Option value="0">GEO Data</Option>
          <Option value="1">CEL Files</Option>
        </Select>
      </div>
    </div>
  );
  let source = '';

  if (props.data.analysisType == '0') {
    source = (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <label className="title" htmlFor="input-access-code">
              Accession Code<span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
            </label>
            <span className="err-message" id="message-load-accession-code"></span>
            <Input
              aria-label="input accessionCode"
              id="input-access-code"
              disabled={props.data.fileList.length !== 0}
              onChange={e => props.changeCode(e)}
              onKeyDown={handleKeyDown}
              value={props.data.accessionCode}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <label className="title" htmlFor="chip">
              Include Chip(s)
            </label>
            <Input
              aria-label="input chip"
              id="chip"
              disabled={props.data.dataList.length > 0 || props.data.multichip}
              onChange={e => props.changeChip(e)}
              onKeyDown={handleKeyDown}
              value={props.data.loadChip}
              placeholder="<All Chips>"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <Button
              id="btn-project-load-gse"
              type={Object.keys(props.data.dataList).length === 0 ? 'primary' : 'default'}
              disabled={props.data.fileList.length !== 0}
              className="upload-start"
              onClick={props.loadGSE}
              loading={uploading}
            >
              Load
            </Button>
          </div>
          <div className="col-sm-6">
            <Tooltip placement="right" title="Reset to start a new GEO analysis">
              <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
                Reset
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  } else if (props.data.analysisType == '1') {
    source = (
      <div>
        <div className="upload-block row">
          <div className="col-sm-12">
            <Upload
              {...properties}
              disabled={Object.keys(props.data.dataList).length != 0}
              style={{ width: '100%' }}
            >
              <Button disabled={Object.keys(props.data.dataList).length != 0}>
                <Icon type="upload" /> Select File
              </Button>
            </Upload>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <Button
              id="btn-project-upload"
              className="upload-start"
              type={props.data.fileList.length === 0 ? 'default' : 'primary'}
              onClick={props.handleUpload}
              disabled={props.data.fileList.length === 0}
              loading={uploading}
            >
              Load
            </Button>
          </div>
          <div className="col-sm-6">
            <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    source = (
      <div className="upload-block row">
        <div className="col-sm-6">
          <Button className="upload-start" type="default" disabled>
            Load
          </Button>
        </div>
        <div className="col-sm-6">
          <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
            Reset
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="block">
      <div className="row">
        <div className="col-sm-12">
          <label className="title" htmlFor="analysisType_selection">
            Choose Analysis Type
          </label>
        </div>
      </div>
      {type_content}
      {source}
    </div>
  );
}
