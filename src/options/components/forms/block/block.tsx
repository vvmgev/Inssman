import React, { useState, useEffect } from 'react';
import { FormMode, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Input from 'components/common/input/input';
import { FormType } from 'models/formFieldModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const CancelForm = ({id, mode, onSave, error, onChange}) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const onChangeSource = event => {
    onChange(event);
    setSource(event.target.value)
  };
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeName = event => {
    onChange(event);
    setName(event.target.value);
  }
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
        ruleData: {
          name,
          matchType,
          source,
          formType: FormType.BLOCK,
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
      });
    }
  }, []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.BLOCK}>
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
           </Form>
    </>
};

export default CancelForm;