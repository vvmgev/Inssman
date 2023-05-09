import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import CrossSVG  from 'assets/icons/cross.svg';
import PencilSVG  from 'assets/icons/pencil.svg';
import SearchSVG  from 'assets/icons/search.svg';
import TrashSVG  from 'assets/icons/trash.svg';
import DocumentCopySVG  from 'assets/icons/documentCopy.svg';
import { PostMessageAction } from 'models/postMessageActionModel';
import { IconsMap } from 'models/formFieldModel';
import { PageTypeMap } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import TrackService from 'src/services/TrackService';
import OutlineButton from 'components/common/outlineButton/outlineButton';
import ColorCover from '../common/colorCover/colorCover';
import Button from '../common/button/button';
import Switcher from '../common/switcher/switcher';
import Tooltip from '../common/tooltip/tooltip';
import 'reactjs-popup/dist/index.css';

export default () => {
  const COUNT_SYMBOLS = 22;
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');
  const onHandleClearSearch = () => setSearch('');
  const onChangeSearch = event => setSearch(event.target.value);
  const onHandleDeleteRules = (): void => chrome.runtime.sendMessage({action: PostMessageAction.DeleteRules }, () => getData());
  const duplicateRule = (id: number): void => chrome.runtime.sendMessage({ action: PostMessageAction.DuplicateRuleById, data: {id} }, () => getData());
  const onChangeRuleStatus = (event, id): void => chrome.runtime.sendMessage({action: PostMessageAction.ChangeRuleStatusById, data: {id, checked: event.target.checked}}, () => getData())
  const getData = (): void => chrome.runtime.sendMessage({action: PostMessageAction.GetStorageRules}, setData);
  const cutString = (string: string): string => string.length > COUNT_SYMBOLS ? string.slice(0, COUNT_SYMBOLS) + '...' : string;
  useEffect(() => getData(), []);
  const handleDelete = (ruleData) => {
      TrackService.trackEvent(`${PageTypeMap[ruleData.pageType]} Rule Delete Event`);
      chrome.runtime.sendMessage({
          action: PostMessageAction.DeleteRuleById, data: {id: ruleData.id} }, 
          () => getData()
      );
  };

  return <div className="min-h-[250px] overflow-hidden mt-[50px]">
      <div className="min-h-[350px] h-[500px] w-full  rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 border border-slate-700">
        {!Boolean(data.length) && <div className="w-full h-full pl-5 py-5">
          <p className="text-2xl">👋 Welcome to Inssman!</p>
          <p className="mt-5 text-lg">Creating a rule gives you control over HTTP requests and responses.</p>
          <p>With Inssman you can easly do following</p>
          <ul className="ml-3 mt-3 list-disc">
            <li className="mt-1">Redirect any type of request</li>
            <li className="mt-1">Block requests</li>
            <li className="mt-1">Add/remove/replace query parameters</li>
            <li className="mt-1">Add/remove/replace/append request headers</li>
            <li className="mt-1">Add/remove/replace/append response headers</li>
            <li className="mt-1">Return custom HTML/CSS/JS/JSON file as a response</li>
            <li className="mt-1">HTTP Logger for request/response headers</li>
            <li className="mt-1">Modify request body</li>
            <li className="mt-1">Inject custom HTML/CSS/JavaScript file</li>
            <li className="mt-1">Delay request (comming soon)</li>
          </ul>
        </div>}
        {Boolean(data.length) && (
          <div>
            <div className="text-lg py-5 max-h-[90%] w-full flex justify-between items-center px-6">
              <span>My Rules</span>
              <div className="flex items-center gap-5">
                <Popup closeOnDocumentClick={true} contentStyle={{background: 'transparent', border: 'none'}}
                      trigger={<div><OutlineButton icon={<TrashSVG />} classes="hover:border-red-400 hover:text-red-400">Delete All Rules</OutlineButton></div>}
                      modal position="right center">
                  {/* @ts-ignore */}
                  {(close: any) => (
                    <ColorCover classes="bg-opacity-90 py-15">
                      <div className="flex border-b border-slate-700 pb-5">
                        <div className="text-slate-200 text-2xl flex-1">Confirm Deletion</div>
                        <div className="flex justify-end flex-1">
                          <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500"><CrossSVG /></span>
                        </div>
                      </div>
                      <div className="text-slate-200 text-2xl text-center my-10">Are you sure you want to delete all rules?</div>
                      <div className="flex flex-row text-slate-200 text-2xl items-center justify-center gap-10">
                        <OutlineButton classes="min-w-[100px]" onClick={close}>No</OutlineButton>
                        <Button icon={<TrashSVG />} classes="min-w-[100px] flex justify-center text-slate-200 bg-red-500 hover:bg-red-600" trackName="Delete All rules Event" onClick={onHandleDeleteRules}>Yes</Button>
                      </div>
                  </ColorCover>
                  )}
                </Popup>
                <div className="text-sm">
                  <Input
                    placeholder="Search By Rule Name"
                    onChange={onChangeSearch}
                    value={search}
                    starts={<span className="w-[24px]"><SearchSVG /></span>}
                    ends={<span onClick={onHandleClearSearch} className="w-[24px] hover:text-red-400 cursor-pointer"><CrossSVG /></span>}
                  />
                </div>
              </div>
            </div>
            <div className="py-3 flex justify-between items-center px-6 w-full border-b border-slate-700 bg-slate-700 bg-opacity-40">
              <div className="flex-1">Name</div>
              <div className="flex-1">Type</div>
              <div className="flex-1">Source</div>
              <div className="flex-1">Status</div>
              <div className="flex-1 flex justify-end">Actions</div>
            </div>
          </div>          
        )}
        {Boolean(data.length) && (
          <ul className="overflow-y-auto h-[350px]">
            {data.filter((ruleData) => ruleData.name.includes(search))
            .reverse().map((ruleData) => <li key={ruleData.id} className="py-5 max-h-[90%] flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40">
              <div className="flex-1 flex" >{cutString(ruleData.name)}</div>
              <div className="flex items-center gap-1 flex-1">
                  <span className="w-[18px]">{IconsMap[ruleData.pageType]}</span>
                  <div>{PageTypeMap[ruleData.pageType]}</div>
              </div>
              <div className="flex-1 flex">{cutString(ruleData.source)}</div>
              <div className="flex-1 flex">
                <Switcher checked={ruleData.enabled} onChange={(event) => onChangeRuleStatus(event, ruleData.id)}/>
              </div>
              <div className="flex-1 flex gap-5 justify-end">
                <Tooltip
                  actions={['hover']}
                  triggerElement={<div className="cursor-pointer hover:text-sky-500" onClick={() => duplicateRule(ruleData.id)}><span className="w-[24px] inline-block"><DocumentCopySVG /></span></div>} >
                    <span className='text-slate-200'>Duplicate Rule</span>
                </Tooltip>
                <Tooltip
                  actions={['hover']}
                  triggerElement={<Link className="cursor-pointer hover:text-sky-500" to={`/edit-rule/${ruleData.pageType}/${ruleData.id}`}><span className="w-[24px] inline-block"><PencilSVG /></span></Link>} >
                    <span className='text-slate-200'>Edit Rule</span>
                </Tooltip>
                <Tooltip
                  actions={['hover']}
                  triggerElement={<div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(ruleData)}><span className="w-[24px] inline-block"><TrashSVG /></span></div>} >
                    <span className='text-slate-200'>Delete Rule</span>
                </Tooltip>
              </div>
            </li>)}
          </ul>
        )}
      </div>
  </div>
}