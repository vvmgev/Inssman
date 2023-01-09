import React, { useState, useEffect, useCallback} from 'react';
import { FormMode, HeaderModificationType, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Input from 'components/common/input/input';
import { FormType } from 'models/formFieldModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import ModifyHeaderFields from '../modifyHeaderFields/modifyHeaderFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation

const ModifyHeaderForm = ({ onSave, mode, id, error, onChange }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const [headers, setHeaders] = useState([{header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]);
  const onChangeSource = event => {
    onChange(event);
    setSource(event.target.value);
  }
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeName = event => {
    onChange(event);
    setName(event.target.value);
  }
  const onAddHeader = () => setHeaders(headers => [...headers, {header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]);
  const onRemoveHeader = (_, index) => setHeaders(headers => headers.filter((_, headerIndex) => headerIndex !== index))
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
    setHeaders(headers => {
      const newHeaders = [...headers]
      newHeaders[index][event.target.name] = event.target.value;
      return newHeaders
    })
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
        ruleData: {
          name,
          source,
          matchType,
          headers,
          formType: FormType.MODIFY_HEADER,
        },
      }
    };
    onSave(form);
  };

  useEffect(() => {
    if(mode === FormMode.UPDATE) {
      chrome.runtime.sendMessage({
        action: PostMessageAction.GetRuleById,
        id,
      }, ({ruleData}) => {
        setSource(ruleData.source);
        setMatchType(ruleData.matchType);
        setName(ruleData.name)
        setHeaders(ruleData.headers)
      });
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.MODIFY_HEADER}>
            <div className="w-1/5">
              <Input
                  value={name}
                  name='name'
                  onChange={onChangeName} 
                  placeholder="Rule Name"
                  error={error?.name}
              />
            </div>
            <div className="flex mt-5 items-center w-full">
              <SourceFields
                matchType={matchType}
                onChangeMatchType={onChangeMatchType}
                source={source}
                onChangeSource={onChangeSource}
                error={error}
              />
            </div>
            <ModifyHeaderFields
              onChangeHeader={onChangeHeader}
              headers={headers}
              onRemoveHeader={onRemoveHeader}
              error={error}
            />
            <div className="border inline-block mt-5 border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer" onClick={onAddHeader}>Add</div>
           </Form>
    </>
};

export default ModifyHeaderForm;