import React, { FC } from 'react';
import Button from '../../common/button/button';

const Form = ({ children, onSubmit, mode = 'create' }: FC ) => {
  const onHandleForm = event => {
    event.preventDefault();
    onSubmit(event);
  }
  return <>
      <div className="w-full p-4 text-base rounded-lg rounded-bl-none rounded-br-none border-b-2 bg-gray-100 mb-5 ">Create New Rule</div>
      <div className="p-3">
        <form onSubmit={onHandleForm}>
          {children}
          <Button>{mode === 'create' ? 'Create' : 'Edit'}</Button>
        </form>
      </div>
    </>
};

export default Form;