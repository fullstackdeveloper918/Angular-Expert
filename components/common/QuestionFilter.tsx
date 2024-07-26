import React from "react";
import { Select } from "antd";
const { Option } = Select;
const QuestionFilter = (props: any) => {

  return (
    <Select
      size="large"
      placeholder="Select Question Type"
      onChange={props?.handleChange}
      value={props?.questionType}
    >
      <Option value="short_text">Short Text</Option>
      <Option value="long_text">Long Text</Option>
      <Option value="dropdown">Dropdown</Option>
      <Option value="single_choice">Single Choice Checkbox</Option>
      <Option value="multi_choice">Multi Choice Checkbox</Option>
    </Select>
  );
};

export default QuestionFilter;
