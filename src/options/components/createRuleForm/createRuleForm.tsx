import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Input from '../common/input/input';
import Button from '../common/button/button';
import Select from '../common/select/select';
import Editor from '../editor/editor';
import { PostMessageAction } from '../../../models/postMessageActionModel'
import { formConfig } from './config';
import { FormType, FormTypeMap, MatchType, MimeType, FormFieldRender } from '../../../models/formFieldModel';
import { escapSymbols, addProtocol, addProtocolRegExp, encode } from '../../utils';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType


export default () => {
    const [state, setState] = useState({});
    const location: any = useLocation();
    const { formType, rule } = location.state;
    const isUpdate: boolean = Boolean(rule);
    console.log(formType, rule)
    const config = formConfig[FormType[formType]];

    const updateState = (name, value) => {
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    const onChangeField = (event) => {
        const name: string = event.target.name;
        const value: string = event.target.value;
        const error = validate(name, value);
        updateState(name, {value, error})
    }

    useEffect(() => {
        if(rule) {
            Object.entries(rule).forEach(item => {
                const [key, value] = item;
                if(FormFieldRender.includes(key)) {
                    updateState([key], {value, error: ''});
                    return;
                }
                updateState([key], value);
            })
            return;
        }
        config.fields.forEach(field => {
            updateState(field.name, {
                value: field.value || field.defaultValue || '', 
                error: ''
            })
        })
    }, []);

    console.log('state', state);
    const validate = (name, value): string | undefined => {
        const validations = config.fields.find(item => item.name === name)?.validations || {}
        const keys = Object.keys(validations);
        for(let i = 0; i < keys.length; i++) {
            if(validations[keys[i]] && validations[keys[i]].rule.test(value)) {
                return validations[keys[i]].message;
            }
        }
    }

    const submitForm = useCallback(event => {
        event.preventDefault();
        const { elements } = event.target
        const data : any = { formType, id: state.id };
        let hasError: boolean = false;
        // elements.length - 1 | exclude button
        for(let i = 0; i < elements.length - 1; i++) {
            const name: string = elements[i].name;
            const value: string = elements[i].value;
            data[elements[i].name] = elements[i].value;
            const error = validate(name, value);
            updateState(name, {value, error});
            if(error) hasError = true;
        }
        if(hasError) return;

        if(data.url) {
            data.url = addProtocol(data.url)
        }
        if(MatchType[data?.matchType] === MatchType.EQUAL) {
            data.regexFilter = escapSymbols(addProtocolRegExp(data.urlFilter));
            data.regexFilterOriginal = data.urlFilter;
            delete data.urlFilter;
        }
        if(MatchType[data?.matchType] === MatchType.REGEXP) {
            data.regexFilter = data.urlFilter;
            delete data.urlFilter;
        }
        if(MatchType[data?.matchType] === MatchType.WILDCARD && FormTypeMap[formType] === RuleActionType.REDIRECT) {
            data.regexFilter = escapSymbols(data.urlFilter);
            data.regexFilterOriginal = data.urlFilter;
            delete data.urlFilter;
            data.regexSubstitution = data.url;
            delete data.url;
        }
        if(FormType[formType] === FormType.MODIFY_RESPONSE) {
            data.url = encode(MimeType[state.language.value.toUpperCase()], state.editor.value);
        }
        chrome.runtime.sendMessage({
            action: (isUpdate ? PostMessageAction.UpdateRule : PostMessageAction.AddRule), data}, 
            data => {
                console.log('data added', data);
            },
        );
        console.log('data', data);
    }, [state])


    
    const generateField = (field: any) => {
        switch (field.type) {
            case 'text':
            return <Input
                type={field.type}
                value={state[field.name]?.value}
                name={field.name}
                classes={field.classes}
                error={state[field.name]?.error}
                placeholder={field.placeholder || field.placeholders[MatchType[state.matchType?.value]]}
                onChange={onChangeField}/>
            case 'select':
            return <Select
                value={state[field.name]?.value || field.defaultValue}
                classes={field.classes}
                name={field.name}
                options={field.options}
                onChange={onChangeField}
            />
            case 'link':
            return <Link
                className={field.classes}
                to={field.to}
                state={{
                    formType,
                    value: state.editor?.value,
                    language: state.editor?.language
                }}
                >{field.label}</Link>
            case 'editor':
                return <Editor
                onChange={onChangeField}
                language={state.language?.value || ''}
                value={state[field.name]?.value || field.defaultValue }
                />
            case 'break':
            return <br/>
        }
    }

    return <>
        <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
        <div className="p-3">
            <form onSubmit={submitForm}>
                <h1>{FormType[formType]}</h1>
                {config.fields.map(field => <span key={field.id}>{generateField(field)}</span>)}
                <div>
                    <Button>{isUpdate ? 'Update' : 'Create'}</Button>
                </div>
            </form>
        </div>
    </>
}