import React from 'react';

interface IPops {
    children?: any;
    onClick?: Function;
    classes?: string;
}

const Button = ({children, onClick, classes}: IPops) => {
    const handler = event => {
        event.preventDefault();
        if(onClick) {
            onClick(event);
        };
    }
    return <button onClick={handler} className={`bg-slate-400 hover:bg-slate-500 text-gray-800 font-bold py-2 px-4 inline-flex items-center rounded-full ${classes}`}>
        {children}
    </button>
}

export default Button;