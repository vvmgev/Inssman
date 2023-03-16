import React from 'react';
import Button from 'components/common/button/button';
import { FormTypeMap, IconsMap } from 'src/models/formFieldModel';
import ColorCover from '../../colorCover/colorCover';

const Form = ({ children, onSubmit, error, formType, mode = 'create' }) => {
  return <ColorCover>
      <div className="flex justify-between mb-3">
        <span className="flex flex-col">
          <span>{mode === 'create' ? 'Create New Rule' : 'Edit Rule'}</span>
          <span className="text-xs gap-1 text-slate-400 flex items-center">
            <span className="w-4">{IconsMap[formType]}</span>
            {FormTypeMap[formType]}
          </span>
        </span>
        <div className="flex gap-5">
          <div className="flex justify-end">
            <a href={`https://github.com/vvmgev/Overrider#${formType}`} target="_blank" rel="noopener noreferrer">
              <div className="border border-slate-700 py-2 px-4 rounded cursor-pointer text-slate-400" >View Example</div>
            </a>
            </div>
          {/* {mode === 'update' && <div>
            <Button classes="bg-red-400 hover:bg-red-500" onClick={onSubmit}>Delete</Button>
          </div>}  */}
          <div>
            <Button
              trackName={`${FormTypeMap[formType]} Rule Create Event`}
              onClick={onSubmit}>
                {mode === 'create' ? 'Create' : 'Edit'}
            </Button>
          </div>
        </div>
      </div>
      {Object.values(error).map((item: any, index: number) => item?.message && <p key={index} className="text-red-500 text-base mb-1">{item.message}</p>)}
      <form>
        {children}
      </form>
    </ColorCover>
};

export default Form;