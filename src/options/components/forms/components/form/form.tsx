import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/button/button';

const Form = ({ children, onSubmit, error, formType, mode = 'create' }) => {
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
      </div>
      <div className="p-3 bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-b border-slate-700 w-full rounded-bl-xl rounded-br-xl">
        <form>
          {children}
        </form>
        {Object.values(error).map((item: any, index: number) => item?.message && <p key={index} className="capitalize text-red-500 text-base">{item.message}</p>)}
        <div className="flex justify-end mt-5">
          <Link to={`/${formType}`}>
            <div className="border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-400" >View Example</div>
          </Link>
        </div>
      </div>
    </>
};

export default Form;