import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import RuleActionType = chrome.declarativeNetRequest.RuleActionType
import deepCopy from 'deepcopy';
import { PostMessageAction } from '../../../models/postMessageAction'
import { formConfig } from './config';
import { FormType, FormTypeMap, MatchType } from '../../../models/formField';
import Input from '../common/input/input';
import Button from '../common/button/button';
import Select from '../common/select/select';
import { escapSymbols, addProtocol } from '../../utils/regExp';
import { webworker } from 'webpack';

export default () => {
    const [state, setState] = useState({});
    const location: any = useLocation();
    const { type } = location.state;
    const config = deepCopy(formConfig[FormType[type]]);

    const onChangeField = (event) => {
        const name: string = event.target.name;
        const value: string = event.target.value;
        const error = validate(name, value);
        setState(state => {
            return {
                ...state,
                [name]: {value, error}
            }
        });
    }

    const validate = (name, value): string | undefined => {
        const validations = config.fields.find(item => item.name === name)?.validations || {}
        const keys = Object.keys(validations);
        for(let i = 0; i< keys.length; i++) {
            if(validations[keys[i]] && validations[keys[i]].rule.test(value)) {
                return validations[keys[i]].message;
            }
        }
    }

    const submitForm = useCallback(event => {
        event.preventDefault();
        const { elements } = event.target
        const data : any = { type };
        let hasError: boolean = false;
        // elements.length - 1 | exclude button
        for(let i = 0; i < elements.length - 1; i++) {
            const name: string = elements[i].name;
            const value: string = elements[i].value;
            data[elements[i].name] = elements[i].value;
            const error = validate(name, value);
            setState(state => {
                return {
                    ...state,
                    [name]: {value, error}
                }
            });
            if(error) hasError = true;
        }
        if(hasError) return;

        if(MatchType[data?.matchType] === MatchType.EQUAL) {
            data.regexFilter = escapSymbols(addProtocol(data.urlFilter));
            delete data.urlFilter;
        }
        if(MatchType[data?.matchType] === MatchType.REGEXP) {
            data.regexFilter = data.urlFilter;
            delete data.urlFilter;
        }
        if(MatchType[data?.matchType] === MatchType.WILDCARD && RuleActionType[type] === RuleActionType.REDIRECT) {
            data.regexFilter = escapSymbols(data.urlFilter);
            delete data.urlFilter;
            data.regexSubstitution = data.redirectTo;
            delete data.redirectTo;
        }
        if(FormTypeMap[type] === RuleActionType.REDIRECT) {
            data.redirectTo = `data:application/json;charset=UTF-8;base64,ewogICAgInRlc3QiOiAicXdxdyIKfQ==`;
        }
        chrome.runtime.sendMessage({action: PostMessageAction.AddRule, data}, (error) => {
            if(error) {
                alert('error')
            }
        });
        console.log(data);
    }, [])


    const generateField = (field: any) => {
        switch (field.type) {
            case 'text':
            return <Input field={field} fieldData={state[field?.name]} onChange={onChangeField}/>
            case 'select':
            return <Select field={field} fieldData={state[field?.name]} onChange={onChangeField}/>
        }
    }

    return <>
        <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
        <div className="p-3">
            <form onSubmit={submitForm}>
                <h1>{FormType[type]}</h1>
                {config.fields.map(field => <span key={field.id}>{generateField(field)}</span>)}
                <div>
                    <Button>Create</Button>
                </div>
            </form>
        </div>
    </>
}