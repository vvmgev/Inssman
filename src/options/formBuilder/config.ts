import React from "react";
import { MatchType, PageType } from "src/models/formFieldModel";

const config = {
    [PageType.BLOCK] : [
            {
                id: 200,
                type: 'ruleName',
                classes: '',
                defaultValues: {
                    name: ''
                },
                placeholder: 'name',
                validations: {
                    required: {
                        rule: /^\s*$/,
                        message: 'Field is required'
                    },
                },

            },
            {
                id: 201,
                type: 'sourceFields',
                defaultValues: {
                    requestMethods: [],
                    matchType: MatchType.CONTAIN,
                    source: '',
                },
                classes: 'w-[10%]',
            },
            // {
            //     id: 1,
            //     name: 'urlFilter',
            //     placeholder: 'some placeholder urlFilter',
            //     type: 'text',
            //     validations: {
            //         required: {
            //             rule: /^\s*$/,
            //             message: 'Field is required'
            //         },
            //         max: {
            //             rule: /\w{30}/,
            //             message: 'Maximum'
            //         },
            //     },
            //     placeholders: {
            //         [MatchType.CONTAIN] : 'cotain',
            //         [MatchType.EQUAL] : 'equal',
            //         // [MatchType.REGEXP] : 'REGEXP',
            //         // [MatchType.WILDCARD] : 'WILDCARD',
            //     },
            // },
    ]
};

export default config;