import { RULETYPE } from '../../../models/formField';
export const formConfig = {
    [RULETYPE.REDIRECT] : {
        fields : [
            {
                id: 1,
                name: 'url',
                placeholder: 'some placeholder',
                type: 'text',
                onChange: function(event, callback) {
                    callback(event)
                }
            },
            {
                id: 2,
                name: 'redirectTo',
                placeholder: 'redirect to some placeholder',
                type: 'text',
                onChange: function(event, callback) {
                    callback(event)
                }
            },
        ]
    }
}