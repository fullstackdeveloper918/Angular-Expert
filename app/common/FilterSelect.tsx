import React, { useState } from 'react';
import { Select, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const FilterSelect = () => {
  const [value, setValue] = useState('Filter Meetings');
  const [options, setOptions] = useState([
    { value: 'status', label: 'Status' },
    { value: 'year', label: 'Year' },
  ]);

  const handleChange = (value: any) => {
    setValue(value);
  };

  const handleStatusClick = ({ key }: { key: string }) => {
    setValue(key);
  };

  const statusMenu = (
    <Menu onClick={handleStatusClick}>
      <Menu.Item key="upcoming">Upcoming</Menu.Item>
      <Menu.Item key="past">Past</Menu.Item>
    </Menu>
  );

  const statusDropdown = (
    <Dropdown overlay={statusMenu} trigger={['hover']}>
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        Status <DownOutlined />
      </a>
    </Dropdown>
  );

  const customOptions = options.map(option => {
    if (option.value === 'status') {
      return { value: 'status', label: statusDropdown };
    }
    return option;
  });

  return (
    <Select
      value={value}
      style={{ width: 220 }}
      size="large"
      onChange={handleChange}
      options={[{ value: 'Filter Meetings', label: 'Filter Meetings' }, ...customOptions]}
    />
  );
};

export default FilterSelect;
