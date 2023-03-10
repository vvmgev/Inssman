import React from 'react';
import TrackService from 'src/services/TrackService';


interface IProps {
    trackName: string;
    children?: any;
    onClick?: Function;
    classes?: string;
}

const Button = ({trackName, children, onClick, classes}: IProps) => {
    const handler = event => {
        event.preventDefault();
        if(onClick) {
            TrackService.trackEvent(trackName);
            onClick(event);
        };
    }
    return <button onClick={handler} className={`bg-slate-200 hover:bg-slate-400 text-gray-800 font-bold py-2 px-4 inline-flex items-center rounded-full ${classes}`}>
        {children}
    </button>
}

export default Button;