import React, { useState, useEffect, useCallback} from 'react';
import { FormMode, HeaderModificationType, MatchType, MatchTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Input from 'src/options/components/common/input/input';
import Button from 'src/options/components//common/button/button';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import ModifyHeaderFields from '../modifyHeaderFields/modifyHeaderFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation

const ModifyHeaderForm = ({ onSave, mode, id, error }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [title, setTitle] = useState<string>('');
  const [headers, setHeaders] = useState([{header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]);
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setTitle(event.target.value);
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
          title,
          source,
          matchType,
          headers,
          url: 'modify-header',
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
        setTitle(ruleData.title)
        setHeaders(ruleData.headers)
      });
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode}>
            <div className="w-1/5">
              <Input
                  value={title}
                  name='title'
                  onChange={onChangeTitle} 
                  placeholder="Rule Title"
              />
            </div>
            <div className="flex mt-5 items-center w-full">
              <SourceFields
                matchType={matchType}
                onChangeMatchType={onChangeMatchType}
                source={source}
                onChangeSource={onChangeSource}
              />
            </div>
            <ModifyHeaderFields
              onChangeHeader={onChangeHeader}
              headers={headers}
              onRemoveHeader={onRemoveHeader}
            />
            <div className="border inline-block mt-5 border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer" onClick={onAddHeader}>Add</div>
            {error && <p>{error}</p>}
           </Form>
    </>
};

export default ModifyHeaderForm;