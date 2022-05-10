import React from 'react';

export default ({field, value, onChange}) => {
    return <div className="mb-4">
        <input className="shadow appearance-none border 
                      rounded w-full py-2 px-3 text-gray-700 
                      leading-tight focus:border-sky-500 focus:outline-none focus:shadow-outline"
                      autoComplete="off"
                      name={field.name}
                      value={value}
                      placeholder={field.placeholder}
                      type={field.type}
                      onChange={event => field.onChange(event, onChange)} />
    </div>
}