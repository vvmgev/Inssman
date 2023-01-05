import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from 'src/options/components/common/input/input';
import Button from 'src/options/components/common/button/button';
import { FormMode, MatchType, MatchTypeMap, QueryParamAction, QueryParams } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import QueryParamFields from '../components/queryParamFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType

const QueryParamForm = ({ onSave, mode, id, error }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [title, setTitle] = useState<string>('');
  const [queryParams, setQueryParams] = useState<QueryParams[]>([{key: '', value: '', action: QueryParamAction.ADD}]);
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setTitle(event.target.value);
  const onAddQueryParam = () => setQueryParams(queryParams => [...queryParams, {key: '', value: '', action: QueryParamAction.ADD}]);
  const onChangeQueryParamAction = (index, event) => {
    setQueryParams(queryParams => {
      const newQueryParams = [...queryParams]
      newQueryParams[index].action = event.target.value;
      return [...newQueryParams];
    })
  };
  const onChangeParam = (property, index, event) => {
    setQueryParams(queryParams => {
      const newQueryParams = [...queryParams]
      newQueryParams[index][property] = event.target.value;
      return newQueryParams
    })
  };

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

  const onRemoveQueryParam = (_, deletingIndex) => {
    setQueryParams(queryParams => queryParams.filter((_, index) => index !== deletingIndex));
  }

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
          title,
          matchType,
          source,
          queryParams,
          url: 'query-param',
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
        setTitle(ruleData.title);
        setQueryParams(ruleData.queryParams);
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
            <div className="w-2/3">
              <QueryParamFields
                onChangeType={onChangeQueryParamAction}
                onChangeParam={onChangeParam}
                queryParams={queryParams}
                onRemove={onRemoveQueryParam}
              />
            </div>
            <div className="border inline-block mt-5 border-slate-700 rounded py-2 px-4 text-slate-400 cursor-pointer" onClick={onAddQueryParam}>Add</div>
           </Form>
    </>
};

export default QueryParamForm;