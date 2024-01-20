import TrackService from "@services/TrackService";
import { ReactNode, PropsWithChildren, FC, ComponentProps, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "icon" | "outline";

type Props = PropsWithChildren<{
  trackName: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: Variant;
  className?: string;
}> &
  ComponentProps<"button">;
HTMLButtonElement;
const styles = {
  primary: "bg-sky-600 hover:bg-sky-400 text-gray-100",
  secondary: "",
  icon: "p-0",
  outline: "border border-slate-500 text-slate-300 hover:border-sky-400 hover:text-sky-400",
  disabled: "text-slate-600 hover:text-slate-600 hover:border-slate-500 cursor-not-allowed",
};

const Button: FC<Props> = ({
  trackName,
  children,
  onClick,
  className,
  startIcon,
  endIcon,
  disabled,
  variant,
  ...rest
}: Props) => {
  const handler = (event) => {
    TrackService.trackEvent(trackName);
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className={twMerge(
        "py-2 px-4 inline-flex items-center rounded outline-0",
        styles[variant || "primary"],
        disabled ? styles.disabled : "",
        className
      )}
      {...rest}
    >
      <span className="flex items-center justify-center gap-2">
        {startIcon && <span className="w-[20px] inline-block">{startIcon}</span>}
        {children}
        {endIcon && <span className="w-[20px] inline-block">{endIcon}</span>}
      </span>
    </button>
  );
};

export default Button;
