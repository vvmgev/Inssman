import { ReactNode, PropsWithChildren } from 'react';
import TrackService from 'src/services/TrackService';
import { twMerge } from 'tailwind-merge'

type Props = PropsWithChildren<{
    onClick?: Function,
    classes?: string;
    trackName: string;
    icon?: ReactNode;
}>


const OutlineButton = ({ classes = '', onClick = () => {}, children, icon, trackName }: Props) => {
    const handler = event => {
        if(onClick) {
            event.preventDefault();
            TrackService.trackEvent(trackName);
            onClick(event);
        };
    }

    return <button className={twMerge('border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:border-sky-400 hover:text-sky-400', classes)}
                onClick={handler}>
                    <span className="flex justify-center items-center gap-2">
                        <span>{children}</span>
                        {icon && <span className="w-[20px] inline-block">{icon}</span>}
                    </span>
            </button>
};

export default OutlineButton;
