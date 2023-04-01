import React from 'react';

const ColorCover = ({ children, classes = '' }) => {
  return <div className={`p-5 rounded-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl
          shadow-inner border border-slate-700 overflow-y-auto w-full h-full ${classes}`}>
    {children}
  </div>

};


export default ColorCover;