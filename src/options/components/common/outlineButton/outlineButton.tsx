import React, { MouseEventHandler, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge'

interface IProps {
    children?: any;
    onClick?: any;
    classes?: string;
    icon?: ReactNode;
}

const OutlineButton = ({ classes = '', onClick = () => {}, children, icon }: IProps) => {
    return <button className={twMerge('border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:text-slate-400 hover:border-slate-700', classes)}
                onClick={onClick}>
                    <span className="flex justify-center items-center gap-2">
                        <span>{children}</span>
                        {icon && <span className="w-[20px] inline-block">{icon}</span>}
                    </span>
            </button>
};

export default OutlineButton;