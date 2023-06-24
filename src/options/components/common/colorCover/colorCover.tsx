import React from 'react';
import { twMerge } from 'tailwind-merge'

const ColorCover = ({ children, classes = '' }) => {
  return <div className={twMerge(`p-2 rounded-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl
          shadow-inner border border-slate-700 overflow-auto`, classes)}>
    {children}
  </div>

};


export default ColorCover;