import React from 'react';

export default ({field, fieldData = {value: ''}, onChange}) => {
    return <select
            className={`${(field.classes || []).join(' ')}`}
            name={field.name} 
            onChange={event => field.onChange(event, onChange)}
            value={fieldData.value}
        >
            {field.options.map((item, id) => {
                return <option key={id} value={item.value}>{item.label}</option>
            })}
        </select>
}