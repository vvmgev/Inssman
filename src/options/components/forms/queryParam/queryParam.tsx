import React, { useEffect, useCallback } from 'react';
import Input from 'components/common/input/input';
import { FormMode, IRule, MatchType, MatchTypeMap, QueryParamAction, QueryParams } from 'models/formFieldModel';
import Form from '../form/form';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import { FormType } from 'models/formFieldModel';
import SourceFields from '../../common/source/sourceFields';
import QueryParamFields from '../../common/queryParamFields/queryParamFields';

const getDefaultData = () => ({
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  queryParams: [{key: '', value: '', action: QueryParamAction.ADD}],
  formType: FormType.QUERY_PARAM,
});

const QueryParamForm = ({ onSave, mode, error, onChange, ruleData, setRuleData }) => {
  const defaultData = getDefaultData();
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          queryParams = defaultData.queryParams} = ruleData;

  const onAddQueryParam = () => {
    onChange({target: { name: 'queryParams', value: [...queryParams, {key: '', value: '', action: QueryParamAction.ADD}]}});
  };

  const onChangeParam = (event, index) => {
    const newQueryParams = [...queryParams]
    newQueryParams[index][event.target.name] = event.target.value;
    onChange({target: { name: 'queryParams', value: newQueryParams }});
  };

  const onRemoveQueryParam = (_, deletingIndex) => {
    onChange({target: { name: 'queryParams', value: queryParams.filter((_, index) => index !== deletingIndex)}});
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
    const form: IRule = {
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
    };
    onSave(form);
  };

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData(defaultData);
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.QUERY_PARAM}>
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
                source={source}
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
            <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={onAddQueryParam}>Add</div>
           </Form>
    </>
};

export default QueryParamForm;