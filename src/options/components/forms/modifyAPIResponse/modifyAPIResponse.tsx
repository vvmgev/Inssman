import React, { useState, useEffect, useMemo } from 'react';
import { EditorLanguage, FormMode, IForm, MatchType, MatchTypeMap, MimeTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import Input from 'src/options/components/common/input/input';
import { encode } from 'src/options/utils';
import Select from '../../common/select/select';
import Editor from '../../editor/editor';
import Form from '../components/form/form';
import SourceFields from '../components/source/sourceFields';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType

const ModifyAPIResponse = ({ onSave, mode, id, error }) => {
  const [source, setSource] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.CONTAIN);
  const [title, setTitle] = useState<string>('');
  const [editorLang, setEditorLang] = useState<EditorLanguage>(EditorLanguage.HTML);
  const [editorValue, setEditorValue] = useState<string>('');
  const onChangeSource = event => setSource(event.target.value);
  const onChangeMatchType = event => setMatchType(event.target.value);
  const onChangeTitle = event => setTitle(event.target.value);
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
          title,
          source,
          matchType,
          editorLang,
          editorValue,
          url: 'modify-response',
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
        setSource(ruleData.source);
        setMatchType(ruleData.matchType);
        setTitle(ruleData.title);
        setEditorLang(ruleData.editorLang)
        setEditorValue(ruleData.editorValue)
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
            <div className="mt-5">
              <SourceFields
                matchType={matchType}
                onChangeMatchType={onChangeMatchType}
                source={source}
                onChangeSource={onChangeSource}
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

export default ModifyAPIResponse;