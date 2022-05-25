import React from 'react';

export default ({value, classes, name, options, onChange}) => {
    return <select
            className={classes}
            name={name} 
            onChange={onChange}
            value={value}
        >
            {options.map((item, id) => {
                return <option key={id} value={item.value}>{item.label}</option>
            })}
        </select>
}