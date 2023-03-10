import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveSVG  from 'assets/icons/remove.svg';
import PencilSVG  from 'assets/icons/pencil.svg';
import SearchSVG  from 'assets/icons/search.svg';
import { PostMessageAction } from '../../../models/postMessageActionModel';
import { IconsMap } from '../../../models/formFieldModel';
import { FormTypeMap } from '../../../models/formFieldModel';
import Input from '../common/input/input';
import TrackService from 'src/services/TrackService';

export default () => {
  const COUNT_SYMBOLS = 22;
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');
  const onChangeSearch = event => setSearch(event.target.value);
  const getData = () => chrome.runtime.sendMessage({action: PostMessageAction.GetStorageRules}, setData);
  const cutString = (string: string): string => string.length > COUNT_SYMBOLS ? string.slice(0, COUNT_SYMBOLS) + '...' : string;
  useEffect(() => getData(), []);
  const handleDelete = (ruleData) => {
      TrackService.trackEvent(`${FormTypeMap[ruleData.formType]} Rule Deleted`);
      chrome.runtime.sendMessage({
          action: PostMessageAction.DeleteRuleById, data: {id: ruleData.id} }, 
          () => getData()
      );
  };

  return <div>
      <div className="rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 w-full border border-slate-700 min-h-[350px]">
        {!data.length && <div className="w-full h-full pl-5 py-5">
          <p className="text-2xl">Welcome to Inssman!</p>
          <p className="mt-5 text-lg">Creating a rule gives you control over HTTP requests and responses.</p>
          <p>With Inssman you can easly do following</p>
          <ul className="ml-3 mt-3 list-disc">
            <li className="mt-1">Redirect any type of request</li>
            <li className="mt-1">Block requests</li>
            <li className="mt-1">Add/remove/replace query parameters</li>
            <li className="mt-1">Add/remove/replace/append request headers</li>
            <li className="mt-1">Add/remove/replace/append response headers</li>
            <li className="mt-1">Return custom HTML/CSS/JS/JSON file as a response</li>
            <li className="mt-1">Add/remove/replace/ request body (comming soon)</li>
            {/* <li className="mt-1">Inject custom HTML/CSS/JavaScript file  (comming soon)</li> */}
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
                starts={<span className="w-[24px]"><SearchSVG /></span>}
                />
            </div>
            </li>
            {data.filter((ruleData) => ruleData.name.includes(search))
            .reverse().map((ruleData) => <li key={ruleData.id} className="py-5 max-h-[90%] overflow-y-auto flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40">
              <div className="flex-1 flex" >{cutString(ruleData.name)}</div>
              <div className="flex items-center gap-1 flex-1">
                  <span className="w-[18px]">{IconsMap[ruleData.formType]}</span>
                  <div>{FormTypeMap[ruleData.formType]}</div>
              </div>
              <div className="flex-1 flex">{cutString(ruleData.source)}</div>
              <div className="flex gap-5 flex-1 justify-end">
                  <Link className="cursor-pointer hover:text-sky-500" to={`/edit-rule/${ruleData.formType}/${ruleData.id}`}><span className="w-[24px] inline-block"><PencilSVG /></span></Link>
                  <div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(ruleData)}><span className="w-[24px] inline-block"><RemoveSVG /></span></div>
              </div>
              </li>)}
          </ul>
        }
      </div>
  </div>
}