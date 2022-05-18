import React, { useCallback } from 'react';


export default ({field, fieldData = {value: '', error: null}, onChange}) => {
    const handler = useCallback((event) => {
        field.onChange(event, onChange)
    }, [])

    return <>
    <input className={`shadow appearance-none border 
                      rounded w-full py-2 px-3 text-gray-700 
                      leading-tight focus:border-sky-500 focus:outline-none focus:shadow-outline
                      ${(field.classes || []).join(' ')}`}
                      autoComplete="off"
                      name={field.name}
                      value={fieldData.value}
                      placeholder={field.placeholder}
                      type={field.type}
                      onChange={handler} />
    {fieldData.error ? <div>{fieldData.error}</div> : ''}
    </>
}