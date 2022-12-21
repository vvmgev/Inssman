import React, { useState } from 'react';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import { MatchType, MatchTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Input from 'src/options/components/common/input/input';
import Form from '../form/form';
import TargetFields from '../target/targetFields';
import { backslashNumber, makeExactMatch, replaceAsterisk } from 'src/options/utils';

const RedirectForm = () => {
  const [redirectTo, setRedirectTo] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [title, setTitle] = useState<string>('');
  const onChangeTarget = event => setTarget(event.target.value);
  const onChangeRedirectTo = event => setRedirectTo(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setTitle(event.target.value);
  const onSubmit = () => {
    const rule: any = {
      action: PostMessageAction.AddRule,
      data: {
        title,
        redirectTo,
        matchType,
        target,
        filterType: MatchTypeMap[matchType],
        ruleActionType: RuleActionType.REDIRECT,
        redirectPropertyType: redirectTo.match(backslashNumber) ? 'regexSubstitution' : 'url',
      }
    };
    if (matchType === MatchType.EQUAL) {
      rule.data.target = makeExactMatch(target);
    }
    if (matchType === MatchType.WILDCARD) {
      rule.data.target = replaceAsterisk(target);
    }
    chrome.runtime.sendMessage(rule);
  };

  return <>
          <Form onSubmit={onSubmit}>
            <Input
                value={title}
                name='title'
                onChange={onChangeTitle} 
                placeholder='Title'
              />
            <TargetFields
              matchType={matchType}
              onChangeMatchType={onChangeMatchType}
              target={target}
              onChangeTarget={onChangeTarget}
              />
            <Input
              value={redirectTo}
              name='redirectTo'
              onChange={onChangeRedirectTo} 
              placeholder='Example'
            />
           </Form>
    </>
};

export default RedirectForm;