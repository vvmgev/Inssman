import React from 'react';
import { twMerge } from 'tailwind-merge'

const OutlineButton = ({ classes = '', onClick = () => {}, children }) => {
    return <button className={twMerge('border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:text-slate-400 hover:border-slate-700', classes)}
                onClick={onClick}>{children}
            </button>
};

export default OutlineButton;