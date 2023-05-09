import React, { useMemo } from 'react';
import { MatchType } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import Select from 'components/common/select/select';
import Tooltip from 'components/common/tooltip/tooltip';
import InfoSVG  from 'assets/icons/info.svg';
import RequestMethod = chrome.declarativeNetRequest.RequestMethod;

const SourceFields = ({ source, onChange, matchType, requestMethod = [], error, sourceProps = {}, matchTypeProps = {}, requestMethodProps = {}, showAllButton = false}) => {
  const matchTypeOptions = useMemo(() => Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const requestMethodOptions = useMemo(() => Object.entries(RequestMethod).reduce((previous: any, [value, label]: any) => {
      previous.push({value: value.toLowerCase(), label})
      return previous;
  }, []), []);

  const placeholders = useMemo(() => ({
    [MatchType.EQUAL]: 'e.g http://google.com',
    // [MatchType.REGEXP]: 'e.g ^http(s):\/\/example\.com\/?$',
    // [MatchType.WILDCARD]: 'e.g. *://google.com/*',
    [MatchType.CONTAIN]: 'e.g google',
  }), []);

  const applyToAllHandler = () => {
    // onChange({target: {name: 'matchType', value: MatchType.WILDCARD}});
    // onChange({target: {name: 'source', value: '*'}});
  }

  return (
    <div className="flex items-center w-full">
      <div className="min-w-[100px]">If Request</div>
      <div className="min-w-[100px]">
        <Select
            onChange={onChange}
            value={matchType}
            options={matchTypeOptions}
            name='matchType'
            error={error?.matchType}
            {...matchTypeProps}
          />
      </div>
      <div className="ml-5 min-w-[280px] flex items-center gap-1">
        <Select
          onChange={onChange}
          value={requestMethod}
          options={requestMethodOptions}
          name='requestMethod'
          error={error?.requestMethod}
          multiple={true}
          placeholder="Request Method"
          {...requestMethodProps}
        />
        <Tooltip
          actions={['hover']}
          triggerElement={<span className="w-[35px] cursor-pointer inline-block"><InfoSVG /></span>} >
              <span className="text-slate-200">To Apply All Request Methods Leave Empty</span>
        </Tooltip>
        
      </div>
      <div className="ml-5 w-2/4">
        <Input
          value={source}
          name='source'
          onChange={onChange}
          placeholder={placeholders[matchType]}
          error={error?.source}
          {...sourceProps}
          />
      </div>
      {showAllButton && <div className="ml-5 w-1/4" onClick={applyToAllHandler}>
        <div className="border inline-block border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer">Apply to all URLs</div>
      </div>}
    </div>
  )
}

export default SourceFields;