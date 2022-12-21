import React, { FC } from 'react';


const Input: FC = ({onChange, classes, error, ...props}: any ) => {
    return <div className={`inline-block ${classes}`}>
    <input className={`shadow appearance-none border 
                      rounded w-full py-2 px-3 text-gray-700
                      leading-tight focus:border-sky-500 focus:outline-none focus:shadow-outline
                      ${error ? 'border border-red-500' : ''}`}
                      autoComplete="off"
                      onChange={onChange}
                      {...props} />
    {error ?  <p className="text-red-500 text-xs">{error}</p> : ''}
    </div>
}

export default Input;