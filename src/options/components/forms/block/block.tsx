import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { FormMode, MatchType, MatchTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Input from 'src/options/components/common/input/input';
import { backslashNumber, makeExactMatch, replaceAsterisk } from 'src/options/utils';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType

const CancelForm = () => {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const mode = id ? FormMode.UPDATE : FormMode.CREATE;
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setName(event.target.value);
  const onSubmit = () => {
    const rule: any = {
      action: mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
      data: {
        name,
        matchType,
        source,
        filterType: MatchTypeMap[matchType],
        ruleActionType: RuleActionType.BLOCK,
        original: {
          source,
        }
      }
    };
    if (id) {
      rule.data.id = id;
    }
    if (matchType === MatchType.EQUAL) {
      rule.data.source = makeExactMatch(source);
    }
    if (matchType === MatchType.WILDCARD) {
      rule.data.source = replaceAsterisk(source);
    }
    chrome.runtime.sendMessage(rule);
  };

  useEffect(() => {
    if(mode === FormMode.UPDATE) {
      chrome.runtime.sendMessage({
        action: PostMessageAction.GetRuleById,
        id,
      }, (data) => {
        setSource(data.original.source);
        setMatchType(data.matchType);
        setName(data.name)
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
           </Form>
    </>
};

export default CancelForm;