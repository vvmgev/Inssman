import React, { useState } from 'react';
import ColorCover from 'components/common/colorCover/colorCover';
import Portal from 'components/portal/portal';
import Input from 'components/common/input/input';

const InputAutocomplete = ({ inputProps, list, id}: any ) => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const onFocus = () => setInputFocused(true);
  const onBlur = () => setTimeout(() => setInputFocused(false), 400);
  const isMatch = list.find(item => item.toLowerCase().includes(inputProps.value.toLowerCase()));
  const handleClick = item => {
    inputProps.onChange({target: {name: inputProps.name, value: item}});
    setInputFocused(false);
  };

  return <div id={`autocomplete-${id}`} className='relative'>
    <Input {...inputProps} onFocus={onFocus} onBlur={onBlur}/>
    {inputFocused && inputProps.value.length > 0 && isMatch &&
      <Portal parentId={`autocomplete-${id}`}>
        <ColorCover classes="rounded-2xl p-0 bg-opacity-70">
            <ul className='max-h-[200px] overflow-y-auto'>
              {list.map((item, index) => item.toLowerCase().includes(inputProps.value.toLowerCase()) && (
                <li key={index} onClick={() => handleClick(item)} className="text-slate-300 cursor-pointer hover:text-sky-500 last:border-none border-b border-slate-700 border-slate h-9 flex items-center">
                  <span className="px-4">{item}</span>
                </li>
              ))}
            </ul>
        </ColorCover>
      </Portal>
    }
  </div>
}
export default InputAutocomplete;