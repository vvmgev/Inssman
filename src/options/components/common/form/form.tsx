import React from 'react';
import Button from 'components/common/button/button';
import OutlineButton from 'components/common/outlineButton/outlineButton';
import TrashSVG  from 'assets/icons/trash.svg';
import PencilSVG  from 'assets/icons/pencil.svg';
import { PageTypeMap, IconsMap } from 'src/models/formFieldModel';

const Form = ({ children, onSubmit, onDelete, error, pageType, mode = 'create' }) => {
  
  const onSubmitHandler = event => {
    event.preventDefault();
    onSubmit();
  };

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
          {mode === 'update' && <OutlineButton classes='hover:border-red-400 hover:text-red-400'
            onClick={onDelete}
            icon={<TrashSVG />}>Delete</OutlineButton>
          } 
          <div>
            <Button
              icon={<PencilSVG />}
              trackName={`${PageTypeMap[pageType]} Rule Create Event`}
              onClick={onSubmit}>
                {mode === 'create' ? 'Create' : 'Edit'}
            </Button>
          </div>
        </div>
      </div>
      {Object.values(error).map((item: any, index: number) => item?.message && <p key={index} className="text-red-500 text-base mb-1">{item.message}</p>)}
      <form onSubmit={onSubmitHandler}>
        {children}
        <input type="submit" className="hidden" />
      </form>
    </>
};

export default Form;