import React, { useCallback } from 'react';
// import CreateRule from '../createRule/createRule';
import { FormType } from '../../../models/formFieldModel';

const CreateRuleList = () => {
    return <>
        <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
        <div className="ml-3 mr-3 flex flex-wrap justify-between">
            {/* {Object.entries(FormType).map((rule, index) => <CreateRule key={index} rule={rule} />)} */}
        </div>
    </>
}
export default CreateRuleList;