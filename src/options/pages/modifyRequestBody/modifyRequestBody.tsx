import React, { useEffect, useRef } from 'react';
import { EditorLanguage, FormMode, MatchType, PageType } from 'src/models/formFieldModel';
import BrowserSupport from 'src/options/components/app/browserSupport';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import Editor from 'src/options/components/common/editor/editor';
import Form from 'src/options/components/common/form/form';
import RuleName from 'src/options/components/common/ruleName/ruleName';
import SourceFields from 'src/options/components/common/source/sourceFields';
import BSService from 'src/services/BrowserSupportService';

const defaultData = {
    name: '',
    source: '',
    matchType: MatchType.CONTAIN,
    pageType: PageType.MODIFY_REQUEST_BODY,
    editorLang: EditorLanguage.JSON,
    editorValue: '',
};

const ModifyRequestBody = ({mode, onSave, error, onChange, ruleData, onDelete, setRuleData}) => {
    const editorRef = useRef<any>();
    const { name = defaultData.name,
        source = defaultData.source,
        matchType = defaultData.matchType,
        editorLang = defaultData.editorLang,
        editorValue = defaultData.editorValue,
        pageType = defaultData.pageType} = ruleData;

    const onSubmit = () => onSave(null);


    useEffect(() => {
      if(mode === FormMode.CREATE) {
        setRuleData(defaultData);
      }
      editorRef.current?.setValue(editorValue);

    }, []);

    if(!BSService.isSupportScripting()) return <BrowserSupport />

    return <div className="mt-[50px] h-full overflow-y-auto">
    <ColorCover>
      <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={pageType}>
        <div className="w-1/5">
          <RuleName value={name} onChange={onChange} error={error} />
        </div>
        <div className="flex mt-5 items-center w-full">
            <SourceFields
                matchType={matchType}
                onChange={onChange}
                source={source}
                error={error}
                showRequestMethod={false}
            />
        </div>
        <div className='mt-5'>
          <Editor editorRef={editorRef} language={editorLang} onChange={onChange} />
        </div>
       </Form>
  </ColorCover>
</div>

};

export default ModifyRequestBody;