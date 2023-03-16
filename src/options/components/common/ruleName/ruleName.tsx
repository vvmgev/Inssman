import React from 'react';
import Input from '../input/input';


const RuleName = ({ onChange, error, value }) => {
    return <Input
        value={value}
        name='name'
        onChange={onChange} 
        placeholder="Rule Name"
        error={error?.name}
        required
    />
};

export default RuleName;