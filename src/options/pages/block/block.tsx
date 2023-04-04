import React, { useEffect } from 'react';
import { FormMode, IRule, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PageType } from 'models/formFieldModel';
import Form from 'components/form/form';
import SourceFields from 'components/common/source/sourceFields';
import RuleName from 'components/common/ruleName/ruleName';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const defaultData = {
  name: '',
  source: '',
  matchType: MatchType.CONTAIN,
  pageType: PageType.BLOCK,
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

  return <div className="h-[150px] min-h-[250px] mt-[50px]">
        <ColorCover>
          <Form onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.BLOCK}>
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
      </ColorCover>
    </div>
};

export default CancelForm;