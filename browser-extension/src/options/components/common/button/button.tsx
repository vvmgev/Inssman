import { ReactNode, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import TrackService from "@services/TrackService";

type Props = PropsWithChildren<{
  trackName: string;
  onClick?: Function;
  classes?: string;
  icon?: ReactNode;
}>;

const Button = ({ trackName, children, onClick, classes, icon }: Props) => {
  const handler = (event) => {
    if (onClick) {
      event.preventDefault();
      TrackService.trackEvent(trackName);
      onClick(event);
    }
  };
  return (
    <button
      onClick={handler}
      className={twMerge(
        "bg-sky-600 hover:bg-sky-400 text-gray-100 hover:text-gray-800 font-bold py-2 px-4 inline-flex items-center rounded outline-0",
        classes
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="w-[20px] inline-block">{icon}</span>}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default Button;
