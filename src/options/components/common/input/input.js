import { forwardRef } from 'react';

const Input = forwardRef(function forwardRefInput({
  onChange, classes, error, starts, ends, disabled, hidden, ...props
}, ref) { return (
  <div className={`inline-block w-full ${classes || ''}`}>
    <div className="flex items-stretch">
      {starts && (
      <div className={`pl-3 rounded-tl rounded-bl bg-slate-700/50 flex justify-center items-center
          ${error ? 'border border-red-500 border-r-0' : ''}
        `}
      >
        {starts}
      </div>
      )}
      <input
        className={`drop-shadow-xl shadow-inner appearance-none bg-slate-700/50
                      rounded ${(starts ? 'rounded-tl-none rounded-bl-none' : '')} ${(starts ? 'rounded-tr-none rounded-br-none' : '')}
                      w-full p-3 leading-tight focus:outline-none focus:shadow-outline
                      ${error ? 'border border-red-500' : ''}
                      ${error && starts ? 'border-l-0' : ''}
                      ${error && ends ? 'border-l-0' : ''}
                      ${disabled ? 'cursor-not-allowed' : ''}
                      `}
        hidden={hidden}
        autoComplete="off"
        onChange={onChange}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      {ends && (
      <div className={`pr-3 rounded-tr rounded-br bg-slate-700/50 flex justify-center items-center
          ${error ? 'border border-red-500 border-r-0' : ''}
        `}
      >
        {ends}
      </div>
      )}
    </div>
  </div>
)}
);

export default Input;
