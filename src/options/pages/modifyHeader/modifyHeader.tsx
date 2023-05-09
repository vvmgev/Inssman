import React, { useEffect, useCallback } from 'react';
import { FormMode, HeaderModificationType, IRule, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PageType } from 'models/formFieldModel';
import ModifyHeaderFields from './modifyHeaderFields';
import SourceFields from 'components/common/source/sourceFields';
import RuleName from 'components/common/ruleName/ruleName';
import Form from 'src/options/components/common/form/form';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation
import ColorCover from 'components/common/colorCover/colorCover';

const getDefaultData = () => ({
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  pageType: PageType.MODIFY_HEADER,
  headers: [{header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}],
  requestMethod: [],
});

const ModifyHeaderForm = ({ onSave, onDelete, mode, setRuleData, ruleData, error, onChange }) => {
  const defaultData = getDefaultData();
  const {name = defaultData.name,
         matchType = defaultData.matchType,
         source = defaultData.source,
         requestMethod = defaultData.requestMethod,
         headers = defaultData.headers} = ruleData;
  
  const onAddHeader = () => {
    onChange({target: { name: 'headers', value: [...headers, {header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]}});
  };
  const onRemoveHeader = (_, index) => {
    onChange({target: { name: 'headers', value: headers.filter((_, headerIndex) => headerIndex !== index)}});
  };
  const getRequestHeaders = useCallback(() => {
    return headers.filter(header => header.header.length && header.type === HeaderModificationType.REQUEST).map(header => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {value: header.value})
    }))
  }, [headers]);
  const getResponseHeaders = useCallback(() => {
    return headers.filter(header => header.header.length && header.type === HeaderModificationType.RESPONSE).map(header => ({
      header: header.header,
      operation: header.operation,
      ...(header.operation !== HeaderOperation.REMOVE && {value: header.value})
    }))
  }, [headers]);

  const onChangeHeader = (event, index) => {
    const newHeaders = [...headers]
    newHeaders[index][event.target.name] = event.target.value;
    onChange({target: { name: 'headers', value: newHeaders }});
  };


  const onSubmit = () => {
    const form: IRule = {
      action: {
        type: RuleActionType.MODIFY_HEADERS,
        ...(getRequestHeaders().length && {requestHeaders: getRequestHeaders()}),
        ...(getResponseHeaders().length && {responseHeaders: getResponseHeaders()})

      },
      condition: {
        [MatchTypeMap[matchType]]: source,
      }
    };
    onSave(form);
  };

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData(defaultData);
    }
  }, []);

  return <div className="h-[150px] min-h-[550px] mt-[50px]">
    <ColorCover>
      <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.MODIFY_HEADER}>
        <div className="w-1/5">
          <RuleName value={name} onChange={onChange} error={error} />
        </div>
        <div className="flex mt-5 items-center w-full">
          <SourceFields
            matchType={matchType}
            requestMethod={requestMethod}
            onChange={onChange}
            source={source}
            error={error}
          />
        </div>
        <ModifyHeaderFields
          onChangeHeader={onChangeHeader}
          headers={headers}
          onRemoveHeader={onRemoveHeader}
          error={error}
        />
        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={onAddHeader}>Add</div>
        </Form>
    </ColorCover>
    </div>
};

export default ModifyHeaderForm;