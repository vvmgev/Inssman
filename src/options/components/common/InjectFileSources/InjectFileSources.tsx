import React, { useMemo } from 'react';
import Select from '../select/select';
import { InjectFileOperator, InjectFileSource, InjectFileType } from 'src/models/formFieldModel';
import Input from '../input/input';
import Editor from '../editor/editor';

const InjectFileSources = ({ onChange, ruleData, error }) => {
    const { editorLang, editorValue, fileSourceType = InjectFileSource.CODE, tagSelector, tagSelectorOperator, fileSource } = ruleData;

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

    const placeholders = useMemo(() => ({
        [InjectFileType.JAVASCRIPT]: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.min.js',
        [InjectFileType.CSS]: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css',
      }), []);

    return <>
        <div className="flex mt-5 items-center w-full">
            <span className="mr-5">Select File Type</span>
            <div className="w-[150px]">
                <Select
                onChange={onChange}
                value={editorLang || 'javascript'}
                options={editorLangOptions}
                name='editorLang'
                />
            </div>
            {editorLang !== InjectFileType.HTML && <div className="flex items-center">
                <span className="mr-5 ml-5">Select Source Type</span>
                <div className="w-[150px]">
                <Select
                    onChange={onChange}
                    value={fileSourceType || 'code'}
                    options={injectFileSourceOptions}
                    name='fileSourceType'
                />
                </div>
            </div>}
            {editorLang === InjectFileType.HTML && <>
                <span className="mr-5 ml-5">Operator</span>
                <div className="w-1/7">
                <Select
                    onChange={onChange}
                    value={tagSelectorOperator || 'beforebegin'}
                    options={injectFileOperatorOptions}
                    name='tagSelectorOperator'
                />
                </div>
                <span className="mr-5 ml-5">Tag Selector</span>
                <div className="w-1/3">
                <Input
                    value={tagSelector || ''}
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
            <div className={`mt-5 ${(fileSourceType === InjectFileSource.CODE || editorLang === InjectFileType.HTML) ? '' : 'hidden'}`}>
                <Editor value={editorValue} language={editorLang || 'javascript'} onChange={onChange} />
            </div>
            {fileSourceType === InjectFileSource.URL && editorLang !== InjectFileType.HTML && <div className="flex mt-5 items-center w-full">
            <span className="mr-5">Select File Type</span>
            <div className="w-2/3">
                <Input
                    value={fileSource || ''}
                    name='fileSource'
                    onChange={onChange} 
                    placeholder={`Source URL ( ${placeholders[editorLang]} )`}
                    error={error?.fileSource}
                    required
                />
            </div>
            </div>}
    </>
};

export default InjectFileSources