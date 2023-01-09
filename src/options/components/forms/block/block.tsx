import React, { useState, useEffect } from 'react';
import { FormMode, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Input from 'components/common/input/input';
import { FormType } from 'models/formFieldModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
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
    const form: any = {
      data: {
        rule: {
          action: {
            type: RuleActionType.BLOCK,
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
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.BLOCK}>
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
           </Form>
    </>
};

export default CancelForm;