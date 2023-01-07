import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostMessageAction } from '../../../models/postMessageActionModel';
import { FormType } from '../../../models/formFieldModel';
import StorageService from '../../../services/StorageService';
import RemoveSVG  from 'assets/icons/remove.svg';
import PencilSVG  from 'assets/icons/pencil.svg';
import BlockSVG  from 'assets/icons/block.svg';
import RedirectSVG  from 'assets/icons/redirect.svg';
import QuestionSVG  from 'assets/icons/question.svg';
import CodeSVG  from 'assets/icons/code.svg';
import SearchSVG  from 'assets/icons/search.svg';
import { FormTypeMap } from '../../../models/formFieldModel';
import Input from '../common/input/input';
import Rule = chrome.declarativeNetRequest.Rule

export default () => {
  const COUNT_SYMBOLS = 22;
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');
  const onChangeSearch = event => setSearch(event.target.value);
  const getData = () => chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, setData);
  const cutString = (string: string): string => string.length > COUNT_SYMBOLS ? string.slice(0, COUNT_SYMBOLS) + '...' : string;
  useEffect(() => getData(), []);
  const handleDelete = (rule: Rule) => {
      chrome.runtime.sendMessage({
          action: PostMessageAction.DeleteRule, data: {rule} }, 
          () => {
              StorageService.remove(String(rule.id))
              getData();
          },
      );
  };

  const icons = {
      [FormType.BLOCK]: <BlockSVG />,
      [FormType.REDIRECT]: <RedirectSVG />,
      [FormType.QUERY_PARAM]: <QuestionSVG />,
      [FormType.MODIFY_HEADER]: <CodeSVG />,
      [FormType.MODIFY_RESPONSE]: <PencilSVG />,
  };

  return <div>
      <div className="rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 w-full border border-slate-700 min-h-[350px]">
        {!data.length && <div className="w-full h-full pl-5 py-5">
          <p className="text-2xl">Welcome to Name!</p>
          <p className="mt-5 text-lg">Creating a rule gives you control over HTTP requests and responses.</p>
          <p>With Name you can easly do following</p>
          <ul className="ml-3 mt-3 list-disc">
            <li className="mt-1">Redirect any type of request</li>
            <li className="mt-1">Block requests</li>
            <li className="mt-1">Add/remove/replace query parameters</li>
            <li className="mt-1">Add/remove/replace/append request headers</li>
            <li className="mt-1">Add/remove/replace/append response headers</li>
            <li className="mt-1">Return custom HTML/CSS/JS/JSON file as a response</li>
            <li className="mt-1">Add/remove/replace/ request body (comming soon)</li>
            <li className="mt-1">Inject custom JavaScript/CSS file  (comming soon)</li>
            <li className="mt-1">Delay request (comming soon)</li>
          </ul>
        </div>}
        {Boolean(data.length) && 
          <ul>
            <li className="text-lg py-5 max-h-[90%] overflow-y-auto flex justify-between items-center px-6 last:border-none border-b border-slate-700 w-full">
            <span>Rules</span>
            <div className="text-sm">
                <Input
                placeholder="Search By Rule Name"
                onChange={onChangeSearch}
                value={search}
                starts={<SearchSVG />}
                />
            </div>
            </li>
            {data.filter(({rule, ruleData}) => ruleData[rule.id].name.includes(search))
            .reverse().map(({rule, ruleData}) => <li key={rule.id} className="py-5 max-h-[90%] overflow-y-auto flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40">
              <div className="flex-1 flex" >{cutString(ruleData[rule.id].name)}</div>
              <div className="flex items-center gap-1 flex-1">
                  <span>{icons[ruleData[rule.id].formType]}</span>
                  <div>{FormTypeMap[ruleData[rule.id].formType]}</div>
              </div>
              <div className="flex-1 flex">{cutString(ruleData[rule.id].source)}</div>
              <div className="flex gap-5 flex-1 justify-end">
                  <Link className="cursor-pointer hover:text-sky-500" to={`/edit-rule/${ruleData[rule.id].formType}/${rule.id}`}><PencilSVG /></Link>
                  <div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(rule)}><RemoveSVG /></div>
              </div>
              </li>)}
          </ul>
        }
      </div>
  </div>
}