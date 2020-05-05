import React from 'react';
import { Tooltip as Antdtooltip } from 'antd';
import './tooltip.css'

export const Tooltip = ({ title, placement, children }) => {
  const style = {
    color: 'black',
    'background-color': 'white',
  };

  return (
    <Antdtooltip style={style} placement={placement || 'bottomLeft'} title={title}>
      {children}
    </Antdtooltip>
  );
};
