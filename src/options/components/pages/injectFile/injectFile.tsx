import React, { useEffect, useMemo, useRef } from 'react';
import Input from 'components/common/input/input';
import { InjectFileType, FormMode, MatchType, InjectFileSource, InjectFileOperator, MatchTypeMap, IRule } from 'models/formFieldModel';
import Form from '../../form/form';
import { PageType } from 'models/formFieldModel';
import SourceFields from '../../common/source/sourceFields';
import Editor from '../../editor/editor';
import Select from '../../common/select/select';
import RuleName from '../../common/ruleName/ruleName';
// import Checkbox from '../../common/checkbox/checkbox';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation
import ColorCover from '../../common/colorCover/colorCover';

const defaultData = {
  name: '',
  matchType: MatchType.CONTAIN,
  source: '',
  editorLang: InjectFileType.JAVASCRIPT,
  editorValue: '',
  pageType: PageType.INJECT_FILE,
  fileSourceType: InjectFileSource.CODE,
  fileSource: '',
  tagSelector: '',
  tagSelectorOperator: InjectFileOperator.AFTERBEGIN,
  shouldRemoveHeader: true,
}

const InjectFileForm = ({ onSave, mode, error, onChange, ruleData, setRuleData }) => {
  const editorRef = useRef<any>();
  const { name = defaultData.name,
          matchType = defaultData.matchType,
          source = defaultData.source,
          editorLang = defaultData.editorLang,
          editorValue = defaultData.editorValue,
          fileSourceType = defaultData.fileSourceType,
          tagSelector = defaultData.tagSelector,
          tagSelectorOperator = defaultData.tagSelectorOperator,
          fileSource = defaultData.fileSource,
          // shouldRemoveHeader = defaultData.shouldRemoveHeader
        } = ruleData;

  const editorLangOptions = useMemo(() => Object.entries(InjectFileType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const injectFileSourceOptions = useMemo(() => Object.entries(InjectFileSource).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const injectFileOperatorOptions = useMemo(() => Object.entries(InjectFileOperator).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const onSubmit = () => {
    if(ruleData.fileSourceType === InjectFileSource.URL) {
      setRuleData({editorValue: ''});
    } else if(ruleData.fileSourceType === InjectFileSource.CODE) {
      setRuleData({fileSource: ''});
    }
    setTimeout(() => {
      const rule: IRule = {
        action: {
          type: RuleActionType.MODIFY_HEADERS,
          responseHeaders: [{
              header: 'Content-Security-Policy',
              operation: HeaderOperation.REMOVE
            }
          ]
        },
        condition: {
          [MatchTypeMap[matchType]]: source,
        }
      };
      onSave(rule);
    });
  };

  useEffect(() => {
    if(mode === FormMode.CREATE) {
      setRuleData(defaultData);
    }
    editorRef.current?.setValue(editorValue);
  }, []);

  const placeholders = useMemo(() => ({
    [InjectFileType.JAVASCRIPT]: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.min.js',
    [InjectFileType.CSS]: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css',
  }), []);

  return <div className="h-[150px] min-h-[550px] mt-[50px]">
    <ColorCover>
      <Form onSubmit={onSubmit} mode={mode} error={error} pageType={PageType.INJECT_FILE}>
        <div className="w-1/5">
          <RuleName value={name} onChange={onChange} error={error} />
        </div>
        <div className="flex mt-5 items-center w-full">
          <SourceFields
            matchType={matchType}
            onChange={onChange}
            source={source}
            error={error}
            showAllButton={false}
          />
        </div>
        <div className="flex mt-5 items-center w-full">
          <span className="mr-5">Select File Type</span>
          <Select
            onChange={onChange}
            value={editorLang}
            options={editorLangOptions}
            name='editorLang'
          />
          {editorLang !== InjectFileType.HTML && <>
            <span className="mr-5 ml-5">Select Source Type</span>
            <Select
              onChange={onChange}
              value={fileSourceType}
              options={injectFileSourceOptions}
              name='fileSourceType'
            />
          </>}
          {editorLang === InjectFileType.HTML && <>
            <span className="mr-5 ml-5">Operator</span>
            <div className="w-1/7">
              <Select
                onChange={onChange}
                value={tagSelectorOperator}
                options={injectFileOperatorOptions}
                name='tagSelectorOperator'
              />
            </div>
            <span className="mr-5 ml-5">Tag Selector</span>
            <div className="w-1/3">
              <Input
                  value={tagSelector}
                  name='tagSelector'
                  onChange={onChange} 
                  placeholder="document.getElementById('app')"
                  error={error?.tagSelector}
              />
            </div>
          </>
          }
        </div>
        {/* <div className="flex mt-5 items-center w-full">
          <Checkbox
            name="shouldRemoveHeader"
            label="Remove Header"
            onChange={onChange}
            checked={shouldRemoveHeader}
            />
        </div> */}
        <div className={`flex mt-5 items-center w-full ${(fileSourceType === InjectFileSource.CODE || editorLang === InjectFileType.HTML) ? '' : 'hidden'}`}>
          <Editor editorRef={editorRef} language={editorLang} onChange={onChange} />
        </div>
        {fileSourceType === InjectFileSource.URL && editorLang !== InjectFileType.HTML && <div className="flex mt-5 items-center w-full">
          <span className="mr-5">Select File Type</span>
          <div className="w-2/3">
            <Input
                value={fileSource}
                name='fileSource'
                onChange={onChange} 
                placeholder={`Source URL ( ${placeholders[editorLang]} )`}
                error={error?.fileSource}
                required
            />
          </div>
        </div>}
        </Form>
      </ColorCover>
    </div>
};

export default InjectFileForm;