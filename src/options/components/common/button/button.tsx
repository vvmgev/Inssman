import React, { ReactNode, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge'
import TrackService from 'src/services/TrackService';

type Props = PropsWithChildren<{
    trackName: string;
    onClick?: Function;
    classes?: string;
    icon?: ReactNode;
}>

const Button = ({trackName, children, onClick, classes, icon}: Props) => {
    const handler = event => {
        event.preventDefault();
        if(onClick) {
            TrackService.trackEvent(trackName);
            onClick(event);
        };
    }
    return <button onClick={handler} className={twMerge('bg-slate-200 hover:bg-slate-400 text-gray-800 font-bold py-2 px-4 inline-flex items-center rounded-full outline-0', classes)}>
        <span className="flex justify-center items-center gap-2">
            <span>{children}</span>
            {icon && <span className="w-[20px] inline-block">{icon}</span>}
        </span>
    </button>
}

export default Button;