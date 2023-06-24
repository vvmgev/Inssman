import React from 'react';
import { IRule } from 'src/models/formFieldModel';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import Form from 'src/options/components/common/form/form';
import FormBuilder from 'src/options/formBuilder/formBuilder';
import config from 'src/options/formBuilder/config';

const Forms = ({ children, ...props }) => {
    const { onDelete, onSave, mode, error, pageType, ruleData } = props;
    const { generateRule } = config[pageType];

    const onSubmit = () => {
        const form: IRule = generateRule(ruleData);
        onSave(form);
    };

    return <ColorCover classes="mx-[5%] p-5">
            <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={pageType}>
                {/* @ts-ignore */}
                <FormBuilder {...props} />
            </Form>
        </ColorCover>
}

export default Forms;