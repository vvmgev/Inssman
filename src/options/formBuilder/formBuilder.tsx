import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import ColorCover from 'components/common/colorCover/colorCover';
import RuleName from 'components/common/ruleName/ruleName';
import config from './config';
import { EditorLanguage, FormMode, HeaderModificationType, IRule, QueryParamAction } from 'src/models/formFieldModel';
import SourceFields from 'components/common/source/sourceFields';
import Form from 'components/common/form/form';
import Destination from 'components/common/destination/destination';
import QueryParamFields from 'components/common/queryParamFields/queryParamFields';
import ModifyHeaderFields from '../pages/modifyHeader/modifyHeaderFields';
import Select from 'components/common/select/select';
import Editor from 'components/common/editor/editor';
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation

const FormBuilder = (props) => {
    const editorRef = useRef<any>();
    const { ruleData, setRuleData, onChange, error, onDelete, onSave, mode, pageType } = props;
    const { fields, generateRule } = config[pageType];

    const onSubmit = () => {
        const form: IRule = generateRule(ruleData);
        onSave(form);
    };

    useEffect(() => {
        if(mode === FormMode.CREATE) {
            let defaultValues: {[key: string]: string | string[]} = {pageType};
            fields.forEach(field => {
                if(field.multipleFields) {
                    defaultValues = {
                        ...defaultValues,
                        ...JSON.parse(JSON.stringify(field.defaultValues))
                    }
                    return
                }
                defaultValues[field.name] = field.defaultValue;
            });
            setRuleData(defaultValues);
        }
        editorRef.current?.setValue(ruleData.editorValue || '');
    }, []);

    const generateField = (field: any) => {
        switch (field.type) {
            case 'ruleName':
                return <div className="w-1/5">
                        <RuleName value={ruleData.name || field.defaultValue} onChange={onChange} error={error} />
                    </div>
            case 'sourceFields':
                return <div className="flex mt-5 items-center w-full">
                            <SourceFields
                                matchType={ruleData.matchType || field.defaultValues.matchType}
                                requestMethods={ruleData.requestMethods || field.defaultValues.requestMethods}
                                onChange={onChange}
                                source={ruleData.source || field.defaultValues.source}
                                error={error} />
                        </div>
            case 'destination':
                return <div className="flex mt-5 items-center">
                        <div className="min-w-[100px]">Redirect to</div>
                            <div className="w-3/5">
                                <Destination 
                                    value={ruleData.destination || field.defaultValue}
                                    onChange={onChange}
                                    error={error}
                                    matchType={ruleData.matchType}
                                />
                            </div>
                        </div>
            case 'queryParamFields':
                return <>
                        <div className="w-full">
                            <QueryParamFields
                                queryParams={ruleData.queryParams || []}
                                onChangeParam={onChangeParam}
                                onRemove={onRemoveQueryParam}
                                error={error}
                            />
                        </div>
                        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={onAddQueryParam}>Add</div>
                    </>
            case 'modifyHeaderFields':
                return <>
                        <ModifyHeaderFields
                            onChangeHeader={onChangeHeader}
                            headers={ruleData.headers || []}
                            onRemoveHeader={onRemoveHeader}
                            error={error}
                            />
                        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={onAddHeader}>Add</div>
                    </>
            case 'editorLang':
                return <div className="mt-5 flex items-center">
                        <span className="mr-5">Select Response Type</span>
                        <div className="w-[150px]">
                            <Select
                                onChange={onChange}
                                value={ruleData.editorLang || field.defaultValue}
                                options={editorLangOptions}
                                name='editorLang'
                            />
                        </div>
                    </div>
            case 'editor':
                return <div className='mt-5'>
                            <Editor editorRef={editorRef} language={ruleData.editorLang || field.defaultValue} onChange={onChange} />
                        </div>
            default:
                break;
        }
    }

    const editorLangOptions = useMemo(() => Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
        previous.push({value: value.toLowerCase(), label})
        return previous;
      }, []), []);

    const onAddHeader = () => {
        onChange({target: { name: 'headers', value: [...ruleData.headers, {header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]}});
    };

    const onRemoveHeader = (_, index) => {
        onChange({target: { name: 'headers', value: ruleData.headers.filter((_, headerIndex) => headerIndex !== index)}});
    };

    const onChangeHeader = (event, index) => {
        const newHeaders = [...ruleData.headers]
        newHeaders[index][event.target.name] = event.target.value;
        onChange({target: { name: 'headers', value: newHeaders }});
    };

    const onAddQueryParam = () => {
        onChange({target: { name: 'queryParams', value: [...ruleData.queryParams, {key: '', value: '', action: QueryParamAction.ADD}]}});
    };

    const onChangeParam = (event, index) => {
        const newQueryParams = [...ruleData.queryParams]
        newQueryParams[index][event.target.name] = event.target.value;
        onChange({target: { name: 'queryParams', value: newQueryParams }});
    };


    const onRemoveQueryParam = (_, deletingIndex) => {
        onChange({target: { name: 'queryParams', value: ruleData.queryParams.filter((_, index) => index !== deletingIndex)}});
    };

    return <div className="mt-[50px] h-full overflow-y-auto">
        <ColorCover>
            <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={pageType}>
                {fields.map(field => <Fragment key={field.id}>{generateField(field)}</Fragment>)}
            </Form>
        </ColorCover>
    </div>
};

export default FormBuilder;