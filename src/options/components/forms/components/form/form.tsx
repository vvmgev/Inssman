import React, { FC } from 'react';
import Button from '../../../common/button/button';

const Form = ({ children, onSubmit, mode = 'create' }) => {
  return <>
      <div className="text-lg rounded-tr-3xl rounded-tl-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-slate-700 w-full">
        <div className="flex justify-between py-5 px-5">
          <span>Create New Rule</span>
          <div>
            <Button onClick={onSubmit}>{mode === 'create' ? 'Create' : 'Edit'}</Button>
          </div>
        </div>
      </div>
      <div className="p-3 bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-b border-slate-700 w-full rounded-bl-xl rounded-br-xl">
        <form>
          {children}
        </form>
      </div>
    </>
};

export default Form;