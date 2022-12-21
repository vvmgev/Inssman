import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostMessageAction } from '../../../models/postMessageActionModel';
import Button from '../common/button/button';
import StorageService from '../../../services/StorageService';
import { FormType } from '../../../models/formFieldModel'
import Rule = chrome.declarativeNetRequest.Rule

export default (): FC => {
    const [rules, setRules] = useState([]);
    const getRules = () => {
        chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, (rules: Rule[]) => {
            setRules(rules);
        });
    };

    useEffect(() => {
        getRules();
    }, []);

    const handleDelete = (rule: Rule) => {
        chrome.runtime.sendMessage({
            action: PostMessageAction.DeleteRule, data: {rule} }, 
            () => {
                StorageService.remove(String(rule.id))
                getRules();
                console.log('data removed');
            },
        );
    }

    return <>
        <div>
            <ul className="bg-white rounded-lg w-full text-gray-900">
                {rules.map(rule => <li key={rule.id} className="px-6 py-2 border-b border-gray-200 w-full">
                    <Link to={`/edit-rule/${rule.id}`}>{rule.name}</Link>
                    <div>{FormType[rule.formType]}</div>
                    <Button onClick={() => handleDelete(rule)}>Delete</Button>
                    </li>)}
            </ul>
        </div>
    </>
}