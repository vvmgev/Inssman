import React, { useEffect } from 'react';
import { FormMode, IRule, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { FormType } from 'models/formFieldModel';
import Form from '../form/form';
import SourceFields from '../../common/source/sourceFields';
import RuleName from '../../common/ruleName/ruleName';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const defaultData = {
  name: '',
  source: '',
  matchType: MatchType.CONTAIN,
  formType: FormType.BLOCK,
}

const CancelForm = ({mode, onSave, error, onChange, ruleData, setRuleData}) => {
  const { name = defaultData.name,
          source = defaultData.source,
          matchType = defaultData.matchType} = ruleData;

  const onSubmit = () => {
    const form: IRule = {
      action: {
        type: RuleActionType.BLOCK,
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

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.BLOCK}>
            <div className="w-1/5">
              <RuleName value={name} onChange={onChange} error={error} />
            </div>
            <div className="flex mt-5 items-center w-full">
              <SourceFields
                matchType={matchType}
                onChange={onChange}
                source={source}
                error={error}
              />
            </div>
           </Form>
    </>
};

export default CancelForm;