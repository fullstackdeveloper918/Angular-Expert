import React, { useState } from 'react';
import { Select, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { Option } = Select;
const QuestionFilter = () => {

    const [questionType, setQuestionType] = useState(null);

    const handleChange = (value:any) => {
        setQuestionType(value);
    };
    console.log(questionType,"tyrytryy");
    
    return (
        <Select
            size="large"
            placeholder="Select Question Type"
            onChange={handleChange}
            value={questionType}
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