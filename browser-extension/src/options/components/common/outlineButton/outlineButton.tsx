import { ReactNode, PropsWithChildren, forwardRef } from "react";
import TrackService from "@services/TrackService";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  onClick?: Function;
  classes?: string;
  trackName: string;
  icon?: ReactNode;
  disabled?: boolean;
}>;

const OutlineButton = forwardRef(
  ({ classes = "", onClick = () => {}, children, icon, trackName, ...rest }: Props, ref: any) => {
    const handler = (event) => {
      if (onClick) {
        event.preventDefault();
        TrackService.trackEvent(trackName);
        onClick(event);
      }
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          "border border-slate-500 py-2 px-4 rounded cursor-pointer text-slate-300 text-center hover:border-sky-400 hover:text-sky-400",
          rest.disabled ? "text-slate-600 hover:text-slate-600 hover:border-slate-500 cursor-not-allowed" : "",
          classes
        )}
        onClick={handler}
        {...rest}
      >
        <span className="flex items-center justify-center gap-2">
          {icon && <span className="w-[20px] inline-block">{icon}</span>}
          <span>{children}</span>
        </span>
      </button>
    );
  }
);

export default OutlineButton;
