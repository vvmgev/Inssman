import React, { useEffect, useMemo } from 'react';
import Input from 'components/common/input/input';
import { FormMode, IRule, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { addProtocol, backslashNumber } from 'options/utils';
import Form from 'src/options/components/common/form/form';
import { PageType } from 'models/formFieldModel';
import SourceFields from 'components/common/source/sourceFields';
import RuleName from 'components/common/ruleName/ruleName';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  pageType: PageType.REDIRECT,
  destination: '',
  requestMethods: [],
}

const RedirectForm = ({ onSave, onDelete, mode, error, onChange, ruleData, setRuleData }) => {
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          requestMethods = defaultData.requestMethods,
          destination = defaultData.destination} = ruleData;
  const onSubmit = () => {
    const form: IRule = {
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          [destination.match(backslashNumber)  ? 'regexSubstitution' : 'url']: addProtocol(destination),
        }
      },
      condition: {
        [MatchTypeMap[matchType]]: source,
      }
    };
    onSave(form);
  };

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData({pageType: PageType.REDIRECT});
    }
  }, []);

  const placeholders = useMemo(() => ({
    [MatchType.EQUAL]: 'e.g http://example.com',
    // [MatchType.REGEXP]: 'e.g http://example.com',
    // [MatchType.WILDCARD]: `e.g http://example.com/${String.fromCharCode(92)}1/${String.fromCharCode(92)}2 (Each backslah with number will be replaced match with *)`,
    [MatchType.CONTAIN]: 'e.g http://example.com',
  }), []);

  return <div className="mt-[50px] h-full overflow-y-auto">
      <ColorCover>
        <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.REDIRECT}>
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
              showAllButton={false}
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
      </ColorCover>
    </div>
};

export default RedirectForm;