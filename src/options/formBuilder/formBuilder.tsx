import React, { Fragment } from 'react';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleName from 'components/common/ruleName/ruleName';
import config from './config';
import { IRule, MatchTypeMap, PageType } from 'src/models/formFieldModel';
import SourceFields from '../components/common/source/sourceFields';
import Form from 'components/common/form/form';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType;

const generateRule = (ruleData) => {
    const form: IRule = {
        action: {
          type: RuleActionType.BLOCK,
        },
        condition: {
          [MatchTypeMap[ruleData.matchType]]: ruleData.source,
        }
      };
    return form;
}

const FormBuilder = ({ ruleData, onChange, error, onDelete, onSave, mode }) => {
    const blockConfig = config[PageType.BLOCK];

    const onSubmit = () => {
        const form: any = generateRule(ruleData);
        console.log('form', form);
        onSave(null);
    };

    const generateField = (field: any) => {
        switch (field.type) {
            case 'ruleName':
                return <div className="w-1/5"><RuleName value={ruleData.name} onChange={onChange} error={error} /></div>
            case 'sourceFields':
                return <div className="flex mt-5 items-center w-full">
                            <SourceFields
                                matchType={ruleData.matchType}
                                requestMethods={ruleData.requestMethods}
                                onChange={onChange}
                                source={ruleData.source}
                                error={error} />
                        </div>
            default:
                break;
        }
    }

    return <div className="mt-[50px] h-full overflow-y-auto">
        <ColorCover>
            <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.BLOCK}>
                {blockConfig.map(field => <Fragment key={field.id}>{generateField(field)}</Fragment>)}
            </Form>
        </ColorCover>
    </div>
};

export default FormBuilder;