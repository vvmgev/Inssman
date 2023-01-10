import React, { useState, useEffect, useCallback} from 'react';
import { FormMode, HeaderModificationType, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Input from 'components/common/input/input';
import { FormType } from 'models/formFieldModel';
import Form from '../form/form';
import ModifyHeaderFields from '../modifyHeaderFields/modifyHeaderFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation
import SourceFields from '../source/sourceFields';

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  formType: FormType.MODIFY_HEADER,
  headers: [{header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}],
}

const ModifyHeaderForm = ({ onSave, mode, setRuleData, ruleData, error, onChange }) => {
  const {name = defaultData.name,
         matchType = defaultData.matchType,
         source = defaultData.source,
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
    const form: any = {
      data: {
        rule: {
          action: {
            type: RuleActionType.MODIFY_HEADERS,
            ...(getRequestHeaders().length && {requestHeaders: getRequestHeaders()}),
            ...(getResponseHeaders().length && {responseHeaders: getResponseHeaders()})

          },
          condition: {
            [MatchTypeMap[matchType]]: source,
          }
        },
      }
    };
    onSave(form);
  };

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData(defaultData);
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.MODIFY_HEADER}>
            <div className="w-1/5">
              <Input
                  value={name}
                  name='name'
                  onChange={onChange} 
                  placeholder="Rule Name"
                  error={error?.name}
              />
            </div>
            <div className="flex mt-5 items-center w-full">
              <SourceFields
                matchType={matchType}
                onChange={onChange}
                onChangeMatchType={onChange}
                source={source}
                onChangeSource={onChange}
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
    </>
};

export default ModifyHeaderForm;