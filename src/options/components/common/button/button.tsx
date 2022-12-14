import React from 'react';

interface IPops {
    children?: any;
    onClick?: Function;
}

const Button = ({children, onClick}: IPops) => {
    return <button onClick={(e) => onClick && onClick(e)} className="bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white">
        {children}
    </button>
}

export default Button;