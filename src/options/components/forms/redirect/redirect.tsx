import React, { useState, useEffect, useMemo } from 'react';
import Input from 'components/common/input/input';
import { FormMode, IForm, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { addProtocol, backslashNumber } from 'options/utils';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import { FormType } from 'models/formFieldModel';

const RedirectForm = ({ onSave, mode, id, error, onChange }) => {
  const [destination, setDestination] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const onChangeSource = event => {
    onChange(event);
    setSource(event.target.value);
  }
  const onChangeDestination = event => {
    onChange(event);
    setDestination(event.target.value);
  };
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeName = event => {
    onChange(event);
    setName(event.target.value);
  }
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
        ruleData: {
          name,
          source,
          destination,
          matchType,
          formType: FormType.REDIRECT,
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
        setDestination(ruleData.destination);
        setSource(ruleData.source);
        setMatchType(ruleData.matchType);
        setName(ruleData.name)
      });
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
                sourceProps={{
                  error: error?.source
                }}

              />
            </div>
            <div className="flex mt-5 items-center">
              <div className="min-w-[100px]">Redirect to</div>
                <div className="w-3/5">
                  <Input
                    value={destination}
                    name='destination'
                    onChange={onChangeDestination} 
                    placeholder={placeholders[matchType]}
                    error={error?.destination}
                  />
                </div>
            </div>
           </Form>
    </>
};

export default RedirectForm;