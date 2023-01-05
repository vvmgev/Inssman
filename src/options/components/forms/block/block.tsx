import React, { useState, useEffect } from 'react';
import { FormMode, MatchType, MatchTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Input from 'src/options/components/common/input/input';
import { FormType } from '../../../../models/formFieldModel';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const CancelForm = ({id, mode, onSave, error}) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [title, setTitle] = useState<string>('');
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setTitle(event.target.value);
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
          title,
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
        setTitle(ruleData.title)
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
            {error && <h1>{error}</h1>}
           </Form>
    </>
};

export default CancelForm;