import { useCallback, useMemo } from 'react';
import { MatchType } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import Select from 'components/common/select/select';
import Tooltip from 'components/common/tooltip/tooltip';
import InfoSVG from 'assets/icons/info.svg';
import AdjustmentVerticalSVG from 'assets/icons/adjustmentVertical.svg';

export const ResourceType = {
  MAIN_FRAME: 'main_frame',
  SUB_FRAME: 'sub_frame',
  STYLESHEET: 'stylesheet',
  SCRIPT: 'script',
  IMAGE: 'image',
  FONT: 'font',
  OBJECT: 'object',
  XMLHTTPREQUEST: 'xmlhttprequest',
  PING: 'ping',
  CSP_REPORT: 'csp_report',
  MEDIA: 'media',
  WEBSOCKET: 'websocket',
  OTHER: 'other',
};

export const RequestMethod = {
  CONNECT: 'connect',
  DELETE: 'delete',
  GET: 'get',
  HEAD: 'head',
  OPTIONS: 'options',
  PATCH: 'patch',
  POST: 'post',
  PUT: 'put',
};

function SourceFields({
  source,
  onChange,
  matchType,
  error,
  requestMethods = [],
  resourceTypes = [],
  showRequestMethods = true,
  showResourceTypes = true,
  sourceProps = {},
  matchTypeProps = {},
  requestMethodsProps = {},
  resourceTypesProps = {},
  showAllButton = false,
  showFields = false,
}) {
  const matchTypeOptions = useMemo(() => Object.entries(MatchType).reduce((previous, [value, label]) => {
    previous.push({ value: value.toLowerCase(), label });
    return previous;
  }, []), []);

  const requestMethodOptions = useMemo(() => Object.entries(RequestMethod).reduce((previous, [value, label]) => {
    previous.push({ value: value.toLowerCase(), label });
    return previous;
  }, []), []);

  const resourceTypeOptions = useMemo(() => Object.entries(ResourceType).reduce((previous, [value, label]) => {
    previous.push({ value: value.toLowerCase(), label: label.replace('_', ' ') });
    return previous;
  }, []), []);

  const placeholders = useMemo(() => ({
    [MatchType.EQUAL]: 'e.g http://google.com',
    // [MatchType.REGEXP]: 'e.g ^http(s):\/\/example\.com\/?$',
    [MatchType.WILDCARD]: 'e.g. *://google.com/*',
    [MatchType.CONTAIN]: 'e.g google',
  }), []);

  const applyToAllHandler = () => {
    // onChange({target: {name: 'matchType', value: MatchType.WILDCARD}});
    // onChange({target: {name: 'source', value: '*'}});
  };
  const toggleFields = useCallback(() => onChange({ target: { name: 'showFields', value: !showFields } }), [showFields]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center w-full">
        <div className="min-w-[100px]">If Request</div>
        <div className="min-w-[100px]">
          <Select
            onChange={onChange}
            value={matchType}
            options={matchTypeOptions}
            name="matchType"
            error={error?.matchType}
            {...matchTypeProps}
          />
        </div>
        <div className="ml-5 w-2/4">
          <Input
            value={source}
            name="source"
            onChange={onChange}
            placeholder={placeholders[matchType]}
            error={error?.source}
            {...sourceProps}
          />
        </div>
        {showRequestMethods && showResourceTypes && (
        <div className="ml-1" onClick={toggleFields}>
          <span className={`w-[35px] cursor-pointer inline-block ${showFields && 'text-sky-500'} hover:text-sky-500`}><AdjustmentVerticalSVG /></span>
        </div>
        )}
        {showAllButton && (
        <div className="ml-5 w-1/4" onClick={applyToAllHandler}>
          <div className="border inline-block border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer">Apply to all URLs</div>
        </div>
        )}
      </div>
      <div className={`${showFields ? 'flex' : 'hidden'} w-full ${(showRequestMethods || showResourceTypes) ? 'mt-5' : ''}`}>
        <div className="min-w-[100px]" />
        {showRequestMethods && (
        <div className="min-w-[340px] flex items-center gap-1">
          <Select
            onChange={onChange}
            value={requestMethods}
            options={requestMethodOptions}
            name="requestMethods"
            error={error?.requestMethods}
            multiple
            placeholder="Request Method"
            {...requestMethodsProps}
          />
          <Tooltip
            actions={['hover']}
            triggerElement={<span className="w-[35px] cursor-pointer inline-block"><InfoSVG /></span>}
          >
            <span className="text-slate-200">To Apply All Request Methods Leave Empty</span>
          </Tooltip>
        </div>
        )}
        {showResourceTypes && (
        <div className="ml-5 min-w-[340px] flex items-center gap-1">
          <Select
            onChange={onChange}
            value={resourceTypes}
            options={resourceTypeOptions}
            name="resourceTypes"
            error={error?.resourceTypes}
            multiple
            placeholder="Resource Types"
            {...resourceTypesProps}
          />
          <Tooltip
            actions={['hover']}
            triggerElement={<span className="w-[35px] cursor-pointer inline-block"><InfoSVG /></span>}
          >
            <span className="text-slate-200">To Apply All Resource Types Leave Empty</span>
          </Tooltip>
        </div>
        )}
      </div>
    </div>
  );
}

export default SourceFields;
