import React from 'react';

const Select = ({value, classes, name, options, onChange}) => {
    return <div className={`inline-block ${classes}`}>
        <select
            className="w-full"
            name={name} 
            onChange={onChange}
            value={value}
        >
            {options.map((item, id) => {
                return <option key={id} value={item.value}>{item.label}</option>
            })}
        </select>
    </div>
}
export default Select;