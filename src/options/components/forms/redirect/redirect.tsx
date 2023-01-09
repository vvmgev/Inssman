import React, { useState, useEffect, useMemo } from 'react';
import Input from 'components/common/input/input';
import { FormMode, IForm, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { addProtocol, backslashNumber } from 'options/utils';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import { FormType } from 'models/formFieldModel';

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  formType: FormType.REDIRECT,
  destination: '',
}

const RedirectForm = ({ onSave, mode, error, onChange, ruleData, setRuleData }) => {
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          destination = defaultData.destination} = ruleData;
  const onSubmit = () => {
    const form: IForm = {
      data: {
        rule: {
          action: {
            type: RuleActionType.REDIRECT,
            redirect: {
              [destination.match(backslashNumber) ? 'regexSubstitution' : 'url']: addProtocol(destination),
            }
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

  const placeholders = useMemo(() => ({
    [MatchType.EQUAL]: 'http://example.com',
    [MatchType.REGEXP]: '^http(s):\/\/example\.com\/?$',
    [MatchType.WILDCARD]: `http://example.com/${String.fromCharCode(92)}1/${String.fromCharCode(92)}2 (Each backslah with number will be replaced match with *)`,
    [MatchType.CONTAIN]: 'http://example.com',
  }), []);

  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.REDIRECT}>
            <div className="w-1/5">
              <Input
                  value={name}
                  name='name'
                  onChange={onChange} 
                  placeholder="Rule Name"
                  error={error?.name}
                  required
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
            <div className="flex mt-5 items-center">
              <div className="min-w-[100px]">Redirect to</div>
                <div className="w-3/5">
                  <Input
                    value={destination}
                    name='destination'
                    onChange={onChange} 
                    placeholder={placeholders[matchType]}
                    error={error?.destination}
                  />
                </div>
            </div>
           </Form>
    </>
};

export default RedirectForm;