import React, { ReactNode } from 'react';
import { PropsWithChildren } from 'src/types';
import { twMerge } from 'tailwind-merge'

type Props = PropsWithChildren<{
    onClick?: Function,
    classes?: string;
    icon?: ReactNode;
}>


const OutlineButton = ({ classes = '', onClick = () => {}, children, icon }: Props) => {
    return <button className={twMerge('border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:text-slate-400 hover:border-slate-700', classes)}
                onClick={e => onClick(e)}>
                    <span className="flex justify-center items-center gap-2">
                        <span>{children}</span>
                        {icon && <span className="w-[20px] inline-block">{icon}</span>}
                    </span>
            </button>
};

export default OutlineButton;