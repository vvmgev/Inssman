import React, { useCallback } from 'react';
import Form from 'src/options/components/common/form/form';
import { IRule, MatchType, MatchTypeMap, QueryParamAction } from 'models/formFieldModel';
import { PageType } from 'models/formFieldModel';
import SourceFields from 'components/common/source/sourceFields';
import QueryParamFields from 'components/common/queryParamFields/queryParamFields';
import RuleName from 'components/common/ruleName/ruleName';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const getDefaultData = () => ({
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  queryParams: [{key: 'qqqq', value: 'qww', action: QueryParamAction.ADD}],
  pageType: PageType.QUERY_PARAM,
  requestMethods: [],
});

const QueryParamForm = ({ onSave, onDelete, mode, error, onChange, ruleData }) => {
  const defaultData = getDefaultData();
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          requestMethods = defaultData.requestMethods,
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


  return <div className="mt-[50px] h-full overflow-y-auto">
    <ColorCover>
      <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.QUERY_PARAM}>
        <div className="w-1/5">
          <RuleName value={name} onChange={onChange} error={error} />
        </div>
        <div className="flex mt-5 items-center w-full">
          <SourceFields
            matchType={matchType}
            requestMethods={requestMethods}
            onChange={onChange}
            source={source}
            error={error}
          />
        </div>
        <div className="w-full">
          <QueryParamFields
            onChangeParam={onChangeParam}
            queryParams={queryParams}
            onRemove={onRemoveQueryParam}
            error={error}
          />
        </div>
        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={onAddQueryParam}>Add</div>
      </Form>
      </ColorCover>
    </div>
};

export default QueryParamForm;