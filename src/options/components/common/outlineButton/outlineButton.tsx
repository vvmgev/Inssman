import React from 'react';

const OutlineButton = ({ classes = '', onClick = () => {}, children }) => {
    return <div className={`border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:text-slate-400 hover:border-slate-700 ${classes}`}
                onClick={onClick}>{children}
            </div>
};

export default OutlineButton;