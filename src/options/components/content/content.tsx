import React from 'react';
import CreateRuleList from '../createRuleList/createRuleList';

export default () => {
    return <>
        <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
        <CreateRuleList />
    </>
}