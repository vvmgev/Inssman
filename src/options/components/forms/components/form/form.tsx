import React from 'react';
import Button from 'components/common/button/button';

const Form = ({ children, onSubmit, error, mode = 'create' }) => {
  return <>
      <div className="py-5 px-5 text-lg rounded-tr-3xl rounded-tl-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-slate-700 w-full">
        <div className="flex justify-between ">
          <span>{mode === 'create' ? 'Create New Rule' : 'Edit Rule'}</span>
          <div className="flex gap-5">
            {/* {mode === 'update' && <div>
              <Button classes="bg-red-400 hover:bg-red-500" onClick={onSubmit}>Delete</Button>
            </div>} */}
            <div>
              <Button onClick={onSubmit}>{mode === 'create' ? 'Create' : 'Edit'}</Button>
            </div>
          </div>
        </div>
        {error?.background && <div className="text-red-500 text-base">{error.background.message}</div>}
      </div>
      <div className="p-3 bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-b border-slate-700 w-full rounded-bl-xl rounded-br-xl">
        <form>
          {children}
        </form>
      </div>
    </>
};

export default Form;