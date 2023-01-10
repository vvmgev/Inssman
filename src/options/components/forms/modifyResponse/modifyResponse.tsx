import React, { useEffect, useMemo } from 'react';
import { EditorLanguage, FormMode, IForm, MatchType, MatchTypeMap, MimeTypeMap } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import { encode } from 'options/utils';
import { FormType } from 'models/formFieldModel';
import Select from 'components/common/select/select';
import Editor from '../../editor/editor';
import Form from '../form/form';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import SourceFields from '../source/sourceFields';

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  formType: FormType.MODIFY_RESPONSE,
  editorLang: EditorLanguage.HTML,
  editorValue: '',
}

const ModifyResponse = ({ onSave, mode, error, onChange, ruleData, setRuleData }) => {
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          editorLang = defaultData.editorLang,
          editorValue = defaultData.editorValue} = ruleData;
          
  const onSubmit = () => {
    const form: IForm = {
      data: {
        rule: {
          action: {
            type: RuleActionType.REDIRECT,
            redirect: {
              url: encode(MimeTypeMap[editorLang], editorValue),
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

  const editorLangOptions = useMemo(() => Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData(defaultData);
    }
  }, []);


  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.MODIFY_RESPONSE}>
            <div className="w-1/5">
              <Input
                  value={name}
                  name='name'
                  onChange={onChange} 
                  placeholder="Rule Name"
                  error={error?.name}
              />
            </div>
            <div className="mt-5">
              <SourceFields
                matchType={matchType}
                onChange={onChange}
                onChangeMatchType={onChange}
                source={source}
                onChangeSource={onChange}
                error={error}
              />
            </div>
            <div className="mt-5">
              <span className="mr-5">Select Response Type</span>
              <Select
                onChange={onChange}
                value={editorLang}
                options={editorLangOptions}
                name='editorLang'
              />
            </div>
            <div className='mt-5'>
              <Editor 
                language={editorLang}
                value={editorValue}
                onChange={onChange}
              />
            </div>
           </Form>
    </>
};

export default ModifyResponse;