import React, { useState, useEffect, useMemo } from 'react';
import { EditorLanguage, FormMode, IForm, MatchType, MatchTypeMap, MimeTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import Input from 'components/common/input/input';
import { encode } from 'options/utils';
import { FormType } from 'models/formFieldModel';
import Select from 'components/common/select/select';
import Editor from '../../editor/editor';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType

const ModifyResponse = ({ onSave, mode, id, error, onChange }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [name, setName] = useState<string>('');
  const [editorLang, setEditorLang] = useState<EditorLanguage>(EditorLanguage.HTML);
  const [editorValue, setEditorValue] = useState<string>('');
  const onChangeSource = event => {
    onChange(event);
    setSource(event.target.value);
  }
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeName = event => {
    onChange(event);
    setName(event.target.value);
  }
  const onChangeEditorLang = event => setEditorLang(event.target.value);
  const onChangeEditorValue = event => setEditorValue(event.target.value);
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
        ruleData: {
          name,
          source,
          matchType,
          editorLang,
          editorValue,
          formType: FormType.MODIFY_RESPONSE
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
    if(mode === FormMode.UPDATE) {
      chrome.runtime.sendMessage({
        action: PostMessageAction.GetRuleById,
        id,
      }, ({ruleData}) => {
        console.log(ruleData);
        setSource(ruleData.source);
        setMatchType(ruleData.matchType);
        setName(ruleData.name);
        setEditorLang(ruleData.editorLang)
        setEditorValue(ruleData.editorValue)
      });
    }
  }, []);


  return <>
          <Form onSubmit={onSubmit} mode={mode} error={error} formType={FormType.MODIFY_RESPONSE}>
            <div className="w-1/5">
              <Input
                  value={name}
                  name='name'
                  onChange={onChangeName} 
                  placeholder="Rule Name"
                  error={error?.name}
              />
            </div>
            <div className="mt-5">
              <SourceFields
                matchType={matchType}
                onChangeMatchType={onChangeMatchType}
                source={source}
                onChangeSource={onChangeSource}
                error={error}
              />
            </div>
            <div className="mt-5">
              <span className="mr-5">Select Response Type</span>
              <Select
                onChange={onChangeEditorLang}
                value={editorLang}
                options={editorLangOptions}
                name='editorLang'
              />
            </div>
            <div className='mt-5'>
              <Editor 
                language={editorLang}
                value={editorValue}
                onChange={onChangeEditorValue}
              />
            </div>
           </Form>
    </>
};

export default ModifyResponse;