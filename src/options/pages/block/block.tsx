import React from 'react';
import { IRule, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PageType } from 'models/formFieldModel';
import Form from 'src/options/components/common/form/form';
import SourceFields from 'components/common/source/sourceFields';
import RuleName from 'components/common/ruleName/ruleName';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const defaultData = {
  name: '',
  source: '',
  matchType: MatchType.CONTAIN,
  pageType: PageType.BLOCK,
  requestMethods: [],
}

const CancelForm = ({mode, onSave, error, onChange, ruleData, onDelete}) => {
  const { name = defaultData.name,
          source = defaultData.source,
          matchType = defaultData.matchType,
          requestMethods = defaultData.requestMethods,
        } = ruleData;

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


  return <div className="mt-[50px] h-full overflow-y-auto">
        <ColorCover>
          <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.BLOCK}>
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
              />
            </div>
           </Form>
      </ColorCover>
    </div>
};

export default CancelForm;