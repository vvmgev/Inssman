import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostMessageAction } from '../../../models/postMessageActionModel';
import Button from '../common/button/button';
import StorageService from '../../../services/StorageService';
import { FormType } from '../../../models/formFieldModel'
import Rule = chrome.declarativeNetRequest.Rule

export default (): FC => {
    const [data, setData] = useState([]);
    const getData = () => chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, setData);

    useEffect(() => {
        getData();
    }, []);

    const handleDelete = (rule: Rule) => {
        chrome.runtime.sendMessage({
            action: PostMessageAction.DeleteRule, data: {rule} }, 
            () => {
                StorageService.remove(String(rule.id))
                getData();
                console.log('data removed');
            },
        );
    }

    return <>
        <div>
            <ul className="bg-white rounded-lg w-full text-gray-900">
                {data.map(({rule, ruleData}) => <li key={rule.id} className="px-6 py-2 border-b border-gray-200 w-full">
                    <Link to={`/edit-rule/${ruleData[rule.id].url}/${rule.id}`}>{ruleData[rule.id].name}</Link>
                    <div>{FormType[ruleData[rule.id].url]}</div>
                    <Button onClick={() => handleDelete(rule)}>Delete</Button>
                    </li>)}
            </ul>
        </div>
    </>
}