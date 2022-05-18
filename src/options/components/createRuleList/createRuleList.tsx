import React, { useCallback } from 'react';
import CreateRule from '../createRule/createRule';
import { FormType } from '../../../models/formField';

export default () => {
    return <div className="ml-3 mr-3 flex flex-wrap justify-between">
        {Object.entries(FormType).map((rule, index) => <CreateRule key={index} rule={rule} />)}
    </div>

}