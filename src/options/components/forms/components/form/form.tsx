import React, { FC } from 'react';
import Button from '../../../common/button/button';

const Form = ({ children, onSubmit, mode = 'create' }: FC ) => {
  return <>
      <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
      <div className="p-3">
        <form>
          {children}
          <Button onClick={onSubmit}>{mode === 'create' ? 'Create' : 'Edit'}</Button>
        </form>
      </div>
    </>
};

export default Form;