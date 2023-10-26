import { FC, ReactElement, useEffect, useState } from 'react';
import TrackService from 'services/TrackService';
import Switcher from 'common/switcher/switcher';
import Tooltip from 'common/tooltip/tooltip';
import PencilSVG  from 'assets/icons/pencil.svg';
import TrashSVG  from 'assets/icons/trash.svg';
import DocumentCopySVG  from 'assets/icons/documentCopy.svg';
import { twMerge } from 'tailwind-merge'
import { PostMessageAction } from 'models/postMessageActionModel';
import { Link } from 'react-router-dom';
import { IRuleMetaData, IconsMap, PageName } from 'models/formFieldModel';
import { timeDifference } from 'utils/timeDifference';

const COUNT_SYMBOLS = 22;
type Props = {
  rules: IRuleMetaData[],
  getRules: () => void,
  search?: string,
  listClasses?: string,
  columns?: [],
  fullColumns? : boolean,
  page? : string,
}

// const LIST_HEADERS = [
//   {name: 'Name'},
//   {name: 'Type'},
//   {name: 'Source'},
//   {name: 'Last Matched', children: <sup className="text-xs inline-block bottom-4 text-red-500">Beta</sup>},
//   {name: 'Status'},
//   {name: 'Actions', last: true},
// ];


const RuleList: FC<Props> = ({ rules, getRules, search = '', fullColumns = true, listClasses = '', page = 'options' }): ReactElement => {
  const duplicateRule = (id: number): void => chrome.runtime.sendMessage({ action: PostMessageAction.CopyRuleById, data: {id} }, () => getRules());
  const cutString = (string: string): string => string.length > COUNT_SYMBOLS ? string.slice(0, COUNT_SYMBOLS) + '...' : string;
  const onChangeRuleStatus = (event, id): void => chrome.runtime.sendMessage({action: PostMessageAction.ChangeRuleStatusById, data: {id, checked: event.target.checked}}, () => getRules())
  const generateLastMatchedTime = (timestamp: number): string => {
    if(typeof timestamp !== 'number') return 'Not used';
    const { days, hours, minutes, seconds } = timeDifference(timestamp);
    if(days) return `${days} day${days > 1 ? 's': ''}  ago`;
    return `${hours > 0 ? `${hours}h` : '' } ${minutes > 0 ? `${minutes}m` : '' } ${hours > 0 ? '' : `${seconds}s`} ago`;
  }

  const handleDelete = (ruleMetaData) => {
    TrackService.trackEvent(`${PageName[ruleMetaData.pageType]} Rule Delete Event`);
    chrome.runtime.sendMessage({
        action: PostMessageAction.DeleteRule, data: {id: ruleMetaData.id} },
        () => getRules()
    );
  };

  return (
    <>
      <div className="py-3 px-6 flex justify-between items-center w-full border-b border-slate-700 bg-slate-700 bg-opacity-40">
        <div className="flex-1">Name</div>
        <div className="flex-1">Type</div>
        <div className="flex-1">Source</div>
        {fullColumns && <div className="flex-1">Last Matched <sup className="text-xs inline-block bottom-4 text-red-500">Beta</sup></div>}
        <div className={`flex-1 ${!fullColumns ? 'flex justify-end' : ''}`}>Status</div>
        {fullColumns && <div className="flex-1 flex justify-end">Actions</div>}
      </div>
      {rules.length ?
      <ul className={twMerge(`overflow-y-auto min-h-[350px] max-h-[450px]`, listClasses)}>
        {rules.filter((ruleMetaData) => ruleMetaData.name.includes(search))
        .reverse().map((ruleMetaData) => <li key={ruleMetaData.id} className="py-5 max-h-[90%] flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40">
          <div className="flex-1 flex" >{cutString (ruleMetaData.name)}</div>
          <div className="flex items-center gap-1 flex-1">
              <span className="w-[18px]">{IconsMap[ruleMetaData.pageType]}</span>
              <div>{PageName[ruleMetaData.pageType]}</div>
          </div>
          <div className="flex-1 flex">{cutString(ruleMetaData.source)}</div>
          {fullColumns && <div className="flex-1 flex">
            <div>{generateLastMatchedTime(ruleMetaData.lastMatchedTimestamp as number)}</div>
          </div>}
          <div className={`flex-1 flex ${!fullColumns ? 'justify-end' : ''}`}>
            <Switcher checked={ruleMetaData.enabled} onChange={(event) => onChangeRuleStatus(event, ruleMetaData.id)}/>
          </div>
          {fullColumns && <div className="flex-1 flex gap-5 justify-end">
            <Tooltip
              actions={['hover']}
              triggerElement={<div className="cursor-pointer hover:text-sky-500" onClick={() => duplicateRule(ruleMetaData.id)}><span className="w-[24px] inline-block"><DocumentCopySVG /></span></div>} >
                <span className='text-slate-200'>Duplicate Rule</span>
            </Tooltip>
            <Tooltip
              actions={['hover']}
              triggerElement={<Link className="cursor-pointer hover:text-sky-500" to={`/edit/${ruleMetaData.pageType}/${ruleMetaData.id}`}><span className="w-[24px] inline-block"><PencilSVG /></span></Link>} >
                <span className='text-slate-200'>Edit Rule</span>
            </Tooltip>
            <Tooltip
              actions={['hover']}
              triggerElement={<div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(ruleMetaData)}><span className="w-[24px] inline-block"><TrashSVG /></span></div>} >
                <span className='text-slate-200'>Delete Rule</span>
            </Tooltip>
          </div>}
        </li>)}
      </ul> :
      <div className="min-h-[350px] max-h-[450px] flex items-center justify-center">
        <div className="w-full text-center">
          <p className="text-2xl">Seems You Have Not Created a Rule Yet</p>
          {page === 'options' ? <p className="mt-3">Please Select One Of Rule In The Sidebar To Create Or Choose a Templates</p> :
          <p className="mt-3">Please Select One Of Rule In The "Create Rule" Tab To Create</p> }
        </div>
      </div>
      }
    </>
  )
}

export default RuleList;
