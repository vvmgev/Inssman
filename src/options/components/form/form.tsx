import React from 'react';
import Button from 'components/common/button/button';
import { PageTypeMap, IconsMap } from 'src/models/formFieldModel';
import OutlineButton from '../common/outlineButton/outlineButton';

const Form = ({ children, onSubmit, error, pageType, mode = 'create' }) => {
  return <>
      <div className="flex justify-between mb-3">
        <span className="flex flex-col">
          <span>{mode === 'create' ? 'Create New Rule' : 'Edit Rule'}</span>
          <span className="text-xs gap-1 text-slate-400 flex items-center">
            <span className="w-4">{IconsMap[pageType]}</span>
            {PageTypeMap[pageType]}
          </span>
        </span>
        <div className="flex gap-5">
          <div className="flex justify-end">
            <a href={`https://github.com/vvmgev/Overrider#${pageType}`} target="_blank" rel="noopener noreferrer">
              <OutlineButton>View Example</OutlineButton>
            </a>
            </div>
          {/* {mode === 'update' && <div>
            <Button classes="bg-red-400 hover:bg-red-500" onClick={onSubmit}>Delete</Button>
          </div>}  */}
          <div>
            <Button
              trackName={`${PageTypeMap[pageType]} Rule Create Event`}
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
    </>
};

export default Form;