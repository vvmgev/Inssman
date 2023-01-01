import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from 'src/options/components/common/input/input';
import Button from 'src/options/components//common/button/button';
import { useParams } from "react-router-dom";
import { FormMode, MatchType, MatchTypeMap, QueryParamAction, QueryParams } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import { makeExactMatch, replaceAsterisk } from 'src/options/utils';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import Select from '../../common/select/select';
import QueryParamFields from '../components/queryParamFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import ResourceType = chrome.declarativeNetRequest.ResourceType

const QueryParamForm = () => {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const mode = id ? FormMode.UPDATE : FormMode.CREATE;
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const [queryParams, setQueryParams] = useState<QueryParams[]>([{key: '', value: '', action: QueryParamAction.ADD}]);
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setName(event.target.value);
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

  const onSubmit = () => {
    const form: any = {
      action: mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
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
            resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME, ResourceType.XMLHTTPREQUEST]
          },
        },
        ruleData: {
          name,
          matchType,
          source,
          queryParams,
          url: 'query-param',
        },
      }
    };
    if (id) {
      form.data.rule.id = id;
    }
    if (matchType === MatchType.EQUAL) {
      form.data.rule.condition[MatchTypeMap[matchType]] = makeExactMatch(source);
    }
    if (matchType === MatchType.WILDCARD) {
      form.data.rule.condition[MatchTypeMap[matchType]] = replaceAsterisk(source);
    }
    chrome.runtime.sendMessage(form);
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
          <Form onSubmit={onSubmit} mode={mode}>
            <Input
              value={name}
              name='title'
              onChange={onChangeTitle} 
              placeholder='Title'
            />
            <SourceFields
              matchType={matchType}
              onChangeMatchType={onChangeMatchType}
              source={source}
              onChangeSource={onChangeSource}
            />
            <QueryParamFields
              onChangeType={onChangeQueryParamAction}
              onChangeParam={onChangeParam}
              queryParams={queryParams}
            />
            <Button onClick={onAddQueryParam}>Add</Button>
           </Form>
    </>
};

export default QueryParamForm;