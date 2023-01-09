import React from 'react';

type Props = {
    value: string;
    name: string;
    options: any;
    onChange: any;
    error?: any;
    classes?: string;
}

const Select = ({value, classes = '', name, options, onChange, error}: Props) => {
    return <div className={`inline-block ${classes}`}>
        <select
            className={`w-full capitalize p-3 px-5 rounded focus:border-none focus:outline-none
            color-white bg-slate-700/50 ${error ? 'border border-red-500' : 'focus:border-none'}`}
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