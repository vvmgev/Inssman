import React from 'react';

const Input = ({onChange, classes, error, starts, ...props}: any ) => {
    return <div className={`inline-block w-full ${classes || ''}`}>
      <div className="flex items-stretch">
        {starts && <div className={`pl-3 rounded-tl rounded-bl bg-slate-700/50 flex justify-center items-center
          ${error ? 'border border-red-500 border-r-0' : ''}
        `}>{starts}</div>}
        <input className={`drop-shadow-xl shadow-inner appearance-none bg-slate-700/50
                      rounded ${(starts ? 'rounded-tl-none rounded-bl-none' : '')} w-full p-3
                      leading-tight focus:outline-none focus:shadow-outline
                      ${error ? 'border border-red-500' : ''}
                      ${error && starts ? 'border-l-0' : ''}
                      `}
                      autoComplete="off"
                      onChange={onChange}
                      {...props} />
      </div>
    </div>
}

export default Input;