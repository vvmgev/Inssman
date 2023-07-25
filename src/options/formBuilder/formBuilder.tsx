import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import config from './config';
import { EditorLanguage, FormMode, HeaderModificationType, IRuleData, QueryParamAction } from 'src/models/formFieldModel';
import SourceFields from 'components/common/source/sourceFields';
import Destination from 'components/common/destination/destination';
import QueryParamFields from 'components/common/queryParamFields/queryParamFields';
import ModifyHeaderFields from '../pages/modifyHeader/modifyHeaderFields';
import Select from 'components/common/select/select';
import Editor from 'components/common/editor/editor';
import InjectFileSources from 'components/common/InjectFileSources/InjectFileSources';
import { structuredClone } from 'options/utils';
import Input from 'components/common/input/input';
import { PropsWithChildren } from 'src/types';
import { FormError } from '../HOC/formHOC';
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

type Props = PropsWithChildren<{
    // Fix the type
    ruleData: any,
    onChange: Function,
    error: FormError,
    mode: FormMode,
    pageType: string,
  }>

const FormBuilder = ({ ruleData, onChange, error, pageType }: Props) => {
    const { fields } = config[pageType];

    const generateField = (field: any) => {
        switch (field.type) {
            case 'input':
                return <div className="w-1/5">
                        <Input 
                            name={field.name}
                            value={ruleData.name || field.defaultValue}
                            onChange={e => onChange(e, field)}
                            placeholder={field.placeholder}
                            error={error?.name} />
                    </div>
            case 'sourceFields':
                return <div className="flex mt-5 items-center w-full">
                            <SourceFields
                                matchType={ruleData.matchType || field.defaultValues.matchType}
                                requestMethods={ruleData.requestMethods || field.defaultValues.requestMethods}
                                resourceTypes={ruleData.resourceTypes || field.defaultValues.resourceTypes}
                                onChange={e => onChange(e, field)}
                                source={ruleData.source || field.defaultValues.source}
                                error={error} 
                                showFields={ruleData.showFields || field.defaultValues.showFields}
                                {...field.props}
                                />
                        </div>
            case 'destination':
                return <div className="flex mt-5 items-center">
                        <div className="min-w-[100px]">Redirect to</div>
                            <div className="w-3/5">
                                <Destination 
                                    value={ruleData.destination || field.defaultValue}
                                    onChange={e => onChange(e, field)}
                                    error={error?.destination}
                                    matchType={ruleData.matchType}
                                />
                            </div>
                        </div>
            case 'queryParamFields':
                return <>
                        <div className="w-full">
                            <QueryParamFields
                                queryParams={ruleData.queryParams || []}
                                onChangeParam={(e, index) => onChangeParam(e, index, field)}
                                onRemove={(e, index) => onRemoveQueryParam(e, index, field)}
                                error={error}
                            />
                        </div>
                        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={() => onAddQueryParam(field)}>Add</div>
                    </>
            case 'modifyHeaderFields':
                return <>
                        <ModifyHeaderFields
                            onChangeHeader={(e, index) => onChangeHeader(e, index, field)}
                            headers={ruleData.headers || []}
                            onRemoveHeader={(e, index) => onRemoveHeader(e, index, field)}
                            error={error}
                            />
                        <div className="border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={() => onAddHeader(field)}>Add</div>
                    </>
            case 'editorLang':
                return <div className="mt-5 flex items-center">
                        <span className="mr-5">Select Response Type</span>
                        <div className="w-[150px]">
                            <Select
                                onChange={(e) => onChange(e, field)}
                                value={ruleData.editorLang || field.defaultValue}
                                options={editorLangOptions}
                                name='editorLang'
                            />
                        </div>
                    </div>
            case 'editor':
                return <div className='mt-5'>
                            <Editor value={ruleData.editorValue} language={ruleData.editorLang || field.defaultValue} onChange={(e) => onChange(e, field)} />
                        </div>
            case 'injectFileSources':
                return <InjectFileSources ruleData={ruleData} onChange={(e) => onChange(e, field)} error={error} />
            default:
                break;
        }
    }

    const editorLangOptions = useMemo(() => Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
        previous.push({value: value.toLowerCase(), label})
        return previous;
      }, []), []);

    const onAddHeader = (field) => {
        onChange({target: { name: 'headers', value: [...ruleData.headers, {header: '', operation: HeaderOperation.SET, value: '', type: HeaderModificationType.REQUEST}]}}, field);
    };

    const onRemoveHeader = (_, index, field) => {
        onChange({target: { name: 'headers', value: ruleData.headers.filter((_, headerIndex) => headerIndex !== index)}}, field);
    };

    const onChangeHeader = (event, index, fleld) => {
        const newHeaders = [...ruleData.headers]
        newHeaders[index][event.target.name] = event.target.value;
        onChange({target: { name: 'headers', value: newHeaders }}, fleld);
    };

    const onAddQueryParam = (field) => {
        onChange({target: { name: 'queryParams', value: [...ruleData.queryParams, {key: '', value: '', action: QueryParamAction.ADD}]}}, field);
    };

    const onChangeParam = (event, index, field) => {
        const newQueryParams = [...ruleData.queryParams]
        newQueryParams[index][event.target.name] = event.target.value;
        onChange({target: { name: 'queryParams', value: newQueryParams }}, field);
    };

    const onRemoveQueryParam = (_, deletingIndex, field) => {
        onChange({target: { name: 'queryParams', value: ruleData.queryParams.filter((_, index) => index !== deletingIndex)}}, field);
    };

    return <>{fields.map(field => <Fragment key={field.id}>{generateField(field)}</Fragment>)}</>
};

export default FormBuilder;