import { Collapse } from 'antd';
import React from 'react';

const Panel = Collapse.Panel;

export default function MAPlot(props) {
  const { pics, data } = props;
  let projectID = data.projectID;
  let gsmGroups = data.groups.filter(group => group != 'Others');
  let group1 = data.group_1;
  let group2 = data.group_2;
  let groupLength = 0;
  let dataList = data.dataList;
  let group1Pics = [];
  let group2Pics = [];
  let panels = [];

  if (dataList.length > 0 && pics != 'No Data' && pics != '') {
    gsmGroups.forEach(g => {
      let group = g.split(',');
      if (group.indexOf(group1) > -1) {
        groupLength++;
      }
    });

    for (let i = 0; i < groupLength; i++) {
      group1Pics.push(pics[i]);
    }

    for (let i = groupLength; i < pics.length; i++) {
      group2Pics.push(pics[i]);
    }

    [group1Pics, group2Pics].map(group => {
      let tmp = [];
      group.forEach((file, i) => {
        let link = './images/' + projectID + file;
        tmp.push(
          <div className="col-md-3" key={'mAplotBN' + i}>
            <div>
              {' '}
              <img src={link} alt="MAplot" />
            </div>
          </div>
        );
      });
      panels.push(tmp);
    });

    let panel1 = (
      <Panel
        header={`${group1} (${group1Pics.length} ${
          group1Pics.length == 1 ? ' Sample )' : ' Samples )'
        }`}
        key={String(group1)}
      >
        <div className="row">{panels[0]}</div>
      </Panel>
    );

    let panel2 = (
      <Panel
        header={`${group2} (${group2Pics.length} ${
          group2Pics.length == 1 ? ' Sample )' : ' Samples )'
        }`}
        key={String(group2)}
      >
        <div className="row">{panels[1]}</div>
      </Panel>
    );

    return <Collapse defaultActiveKey={[group1, group2]}>{[panel1, panel2]}</Collapse>;
  } else {
    return 'No Data';
  }
}
