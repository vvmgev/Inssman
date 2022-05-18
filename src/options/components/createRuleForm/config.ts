import { FormType, MatchType } from '../../../models/formField';
export const formConfig = {
    [FormType.REDIRECT] : {
        fields : [
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: ['w-[10%]'],
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
                onChange: function(event, callback) {
                    callback(event);
                },
            },
            {
                id: 1,
                name: 'urlFilter',
                placeholder: 'some placeholder urlFilter',
                type: 'text',
                classes: ['w-1/4'],
                onChange: function(event, callback) {
                    callback(event)
                }
            },
            {
                id: 2,
                name: 'redirectTo',
                placeholder: 'redirect to some placeholder',
                type: 'text',
                classes: ['w-1/4'],
                onChange: function(event, callback) {
                    callback(event)
                }
            },
        ]
    },
    [FormType.BLOCK] : {
        fields : [
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: ['w-[10%]'],
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
                onChange: function(event, callback) {
                    callback(event);
                }
            },
            {
                id: 1,
                name: 'urlFilter',
                placeholder: 'some placeholder urlFilter',
                type: 'text',
                onChange: function(event, callback) {
                    callback(event);
                },
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                    max: {
                        rule: /\w{30}/,
                        message: 'Maximum'
                    },
                }
            },
        ]
    },
    [FormType.MODIFYRESPONSE] : {
        fields : [
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: ['w-[10%]'],
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
                onChange: function(event, callback) {
                    callback(event);
                }
            },
            {
                id: 1,
                name: 'urlFilter',
                placeholder: 'some placeholder urlFilter',
                type: 'text',
                onChange: function(event, callback) {
                    callback(event);
                },
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                }
            },
        ]
    }
}