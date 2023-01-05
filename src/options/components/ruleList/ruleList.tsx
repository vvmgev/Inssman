import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostMessageAction } from '../../../models/postMessageActionModel';
import { FormType } from '../../../models/formFieldModel';
import StorageService from '../../../services/StorageService';
import RemoveSVG  from '../../../assets/icons/remove.svg';
import PencilSVG  from '../../../assets/icons/pencil.svg';
import BlockSVG  from '../../../assets/icons/block.svg';
import RedirectSVG  from '../../../assets/icons/redirect.svg';
import QuestionSVG  from '../../../assets/icons/question.svg';
import CodeSVG  from '../../../assets/icons/code.svg';
import Rule = chrome.declarativeNetRequest.Rule
import { FormTypeMap } from '../../../models/formFieldModel';

export default () => {
    const [data, setData] = useState<any>([]);
    const getData = () => chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, setData);
    useEffect(() => getData(), []);
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
    const icons = {
        [FormType.BLOCK]: <BlockSVG />,
        [FormType.REDIRECT]: <RedirectSVG />,
        [FormType.QUERY_PARAM]: <QuestionSVG />,
        [FormType.MODIFY_HEADER]: <CodeSVG />,
        [FormType.MODIFY_RESPONSE]: <PencilSVG />,
    }

    return <>
        <div className="rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 w-full border border-slate-700">
            <ul>
            <li className="text-lg py-5 max-h-[90%] overflow-y-auto flex justify-between items-center px-6 last:border-none border-b border-slate-700 w-full">Rules</li>
                {data.map(({rule, ruleData}) => <li key={rule.id} className="py-5 max-h-[90%] overflow-y-auto flex justify-between items-center px-6 last:border-none border-b border-slate-700 w-full">
                        <div>{ruleData[rule.id].title}</div>
                        <div className="flex items-center gap-1">
                            <span>{icons[ruleData[rule.id].formType]}</span>
                            <div>{FormTypeMap[ruleData[rule.id].formType]}</div>
                        </div>
                        <div>{ruleData[rule.id].source}</div>
                        <div className="flex gap-5">
                            <Link className="cursor-pointer" to={`/edit-rule/${ruleData[rule.id].url}/${rule.id}`}><PencilSVG /></Link>
                            <div className="cursor-pointer" onClick={() => handleDelete(rule)}><RemoveSVG /></div>
                        </div>
                    </li>)}
            </ul>
        </div>
    </>
}