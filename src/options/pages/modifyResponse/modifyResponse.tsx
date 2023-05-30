import React, { useEffect, useMemo, useRef } from 'react';
import { EditorLanguage,  IRule, MatchType, MatchTypeMap, MimeTypeMap } from 'models/formFieldModel';
import { encode } from 'options/utils';
import { PageType } from 'models/formFieldModel';
import Select from 'components/common/select/select';
import Editor from 'src/options/components/common/editor/editor';
import Form from 'src/options/components/common/form/form';
import SourceFields from 'components/common/source/sourceFields';
import RuleName from 'components/common/ruleName/ruleName';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  pageType: PageType.MODIFY_RESPONSE,
  editorLang: EditorLanguage.HTML,
  editorValue: '',
  requestMethods: []
}

const ModifyResponse = ({ onSave, onDelete, mode, error, onChange, ruleData }) => {
  const editorRef = useRef<any>();
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          editorLang = defaultData.editorLang,
          editorValue = defaultData.editorValue,
          requestMethods = defaultData.requestMethods
        } = ruleData;

  const onSubmit = () => {
    const form: IRule = {
      action: {
        type: RuleActionType.REDIRECT,
        redirect: {
          url: encode(MimeTypeMap[editorLang], editorValue),
        }
      },
      condition: {
        [MatchTypeMap[matchType]]: source,
      }
    };
    onSave(form);
  };

  const editorLangOptions = useMemo(() => Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  useEffect(() => {
    editorRef.current.setValue(editorValue);
  }, []);

  return <div className="mt-[50px] h-full overflow-y-auto">
    <ColorCover>
      <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.MODIFY_RESPONSE}>
        <div className="w-1/5">
          <RuleName value={name} onChange={onChange} error={error} />
        </div>
        <div className="mt-5">
          <SourceFields
            matchType={matchType}
            requestMethods={requestMethods}
            onChange={onChange}
            source={source}
            error={error}
          />
        </div>
        <div className="mt-5 flex items-center">
          <span className="mr-5">Select Response Type</span>
          <div className="w-[150px]">
            <Select
              onChange={onChange}
              value={editorLang}
              options={editorLangOptions}
              name='editorLang'
            />
          </div>
        </div>
        <div className='mt-5'>
          <Editor editorRef={editorRef} language={editorLang} onChange={onChange} />
        </div>
        </Form>
      </ColorCover>
    </div>
};

export default ModifyResponse;