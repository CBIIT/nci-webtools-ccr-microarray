import React, { useState } from 'react';
import { Input } from 'antd';
import { Tooltip } from '../Tooltip/Tooltip';

export const TableHeader = ({
  id,
  field,
  settings,
  searchKey,
  searchFn,
  sorter,
}) => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <label htmlFor={id}>
        <Input
          aria-label={id}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => searchFn(searchKey, search)}
          placeholder={field}
          id={id}
        />
      </label>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title={id}>{field}</Tooltip>
        <div style={{ marginLeft: '1rem' }}>
          {settings.sorting.name == field ? (
            settings.sorting.order == 'ascend' ? (
              <div>
                <a
                  style={{ color: 'blue' }}
                  onClick={() => sorter(field, 'descend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
            ) : (
              <div>
                <a
                  style={{ color: 'blue' }}
                  onClick={() => sorter(field, 'ascend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            )
          ) : (
            <div className="head-sorter">
              <div>
                <a
                  style={{ color: '#ccc' }}
                  onClick={() => sorter(field, 'ascend')}
                >
                  <i className="fas fa-angle-up"></i>
                </a>
              </div>
              <div>
                <a
                  style={{ color: '#ccc' }}
                  onClick={() => sorter(field, 'descend')}
                >
                  <i className="fas fa-angle-down"></i>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
