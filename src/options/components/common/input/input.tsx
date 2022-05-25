import React from 'react';


export default ({value = '', error = null, name, placeholder, type, classes, onChange}) => {

    return <>
    <input className={`shadow appearance-none border 
                      rounded w-full py-2 px-3 text-gray-700 
                      leading-tight focus:border-sky-500 focus:outline-none focus:shadow-outline
                      ${classes}`}
                      autoComplete="off"
                      name={name}
                      value={value}
                      placeholder={placeholder}
                      type={type}
                      onChange={onChange} />
    {error ? <div>{error}</div> : ''}
    </>
}