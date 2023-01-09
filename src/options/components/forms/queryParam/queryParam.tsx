import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from 'components/common/input/input';
import { FormMode, MatchType, MatchTypeMap, QueryParamAction, QueryParams } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import QueryParamFields from '../components/queryParamFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import { FormType } from 'models/formFieldModel';

const QueryParamForm = ({ onSave, mode, id, error, onChange }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const [queryParams, setQueryParams] = useState<QueryParams[]>([{key: '', value: '', action: QueryParamAction.ADD}]);
  const onChangeSource = event => {
    onChange(event);
    setSource(event.target.value);
  }
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeName = event => {
    onChange(event);
    setName(event.target.value);
  }
  const onAddQueryParam = () => setQueryParams(queryParams => [...queryParams, {key: '', value: '', action: QueryParamAction.ADD}]);

  const onChangeParam = (event, index) => {
    setQueryParams(queryParams => {
      const newQueryParams = [...queryParams]
      newQueryParams[index][event.target.name] = event.target.value;
      return newQueryParams
    })
  };

  const onRemoveQueryParam = (_, deletingIndex) => {
    setQueryParams(queryParams => queryParams.filter((_, index) => index !== deletingIndex));
  }

  const getQueryParams = useCallback(() => {
    return queryParams.filter(queryParam => queryParam.key.length && queryParam.action !== QueryParamAction.REMOVE).map(queryParam => ({
          key: queryParam.key,
          value: queryParam.value,
          replaceOnly: queryParam.action === QueryParamAction.REPLACE,
      }
  ));
  }, [queryParams]);

  const getRemoveQueryParams = useCallback(() => {
    return queryParams.filter(queryParam => queryParam.key.length && queryParam.action === QueryParamAction.REMOVE).map(queryParam => queryParam.key);
  }, [queryParams]);

  const onSubmit = () => {
    const form: any = {
      data: {
        rule: {
          action: {
            type: RuleActionType.REDIRECT,
            redirect: {
              transform:{
                queryTransform: {
                  addOrReplaceParams: getQueryParams(),
                  removeParams: getRemoveQueryParams(),
                }
              }
            }
          },
          condition: {
            [MatchTypeMap[matchType]]: source,
          },
        },
        ruleData: {
          name,
          matchType,
          source,
          queryParams,
          formType: FormType.QUERY_PARAM,
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
        setName(ruleData.name);
        setQueryParams(ruleData.queryParams);
      });
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.QUERY_PARAM}>
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
            <div className="w-2/3">
              <QueryParamFields
                onChangeParam={onChangeParam}
                queryParams={queryParams}
                onRemove={onRemoveQueryParam}
                error={error}
              />
            </div>
            <div className="border inline-block mt-5 border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer" onClick={onAddQueryParam}>Add</div>
           </Form>
    </>
};

export default QueryParamForm;