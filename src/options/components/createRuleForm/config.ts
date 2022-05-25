import { FormType, MatchType, Language } from '../../../models/formFieldModel';
export const formConfig = {
    [FormType.REDIRECT] : {
        fields : [
            {
                id: 4,
                name: 'name',
                type: 'text',
                classes: 'w-[50%]',
                placeholder: 'name',
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                }
            },
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: 'w-[10%]',
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
            },
            {
                id: 1,
                name: 'urlFilter',
                placeholder: 'some placeholder urlFilter',
                type: 'text',
                classes: 'w-1/4',
            },
            {
                id: 2,
                name: 'url',
                placeholder: 'redirect to some placeholder',
                type: 'text',
                classes: 'w-1/4',
            },
        ]
    },
    [FormType.BLOCK] : {
        fields : [
            {
                id: 4,
                name: 'name',
                type: 'text',
                classes: 'w-[50%]',
                placeholder: 'name',
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                }
            },
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: 'w-[10%]',
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
            },
            {
                id: 1,
                name: 'urlFilter',
                placeholder: 'some placeholder urlFilter',
                type: 'text',
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
    [FormType.MODIFY_RESPONSE] : {
        fields : [
            {
                id: 5,
                name: 'name',
                type: 'text',
                classes: 'w-[50%]',
                placeholder: 'name',
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                }
            },
            {
                id: 3,
                name: 'matchType',
                type: 'select',
                classes: 'w-[10%]',
                options: Object.entries(MatchType).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
                defaultValue: MatchType.CONTAIN.toUpperCase(),
            },
            {
                id: 1,
                type: 'text',
                name: 'urlFilter',
                classes: 'w-[40%]',
                placeholders: {
                    [MatchType.CONTAIN] : 'cotain',
                    [MatchType.EQUAL] : 'equal',
                    [MatchType.REGEXP] : 'REGEXP',
                    [MatchType.WILDCARD] : 'WILDCARD',
                },
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                }
            },
            {
                id: 33,
                name: 'language',
                type: 'select',
                classes: 'w-[10%]',
                options: Object.entries(Language).reduce((previous: any, current: any) => {
                    previous.push({value: current[0], label: current[1]})
                    return previous;
                }, []),
                defaultValue: Language.JAVASCRIPT,
            },
            {
                id: 4,
                type: 'editor',
                name: 'editor',
                defaultValue: ''
            }
            // {
            //     id: 2,
            //     type: 'link',
            //     label: 'Edit',
            //     to: { pathname: "/edit" },
            //     classes: 'w-[40%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full',
            // },
            // {
            //     id: 4,
            //     name: 'url',
            //     placeholder: 'Please edit',
            //     type: 'hiddenText',
            //     classes: ['hidden'],
            //     validations: {
            //         required: {
            //             rule: /^\s*$/,
            //             message: 'Field is required'
            //         },
            //     }
            // },
        ]
    }
}