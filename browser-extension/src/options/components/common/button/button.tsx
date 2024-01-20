import TrackService from "@services/TrackService";
import { ReactNode, PropsWithChildren, FC, ComponentProps, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "icon" | "outline";
type Styles = Record<Variant | "disabled", string>;

type Props = PropsWithChildren<{
  trackName: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: Variant;
  className?: string;
}> &
  ComponentProps<"button">;

const styles: Styles = {
  primary: "bg-sky-600 hover:bg-sky-400 text-gray-100",
  secondary: "",
  outline: "border border-slate-500 text-slate-300 hover:border-sky-400 hover:text-sky-400",
  icon: "p-0",
  disabled: "",
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
        "py-2 px-4 inline-flex items-center rounded outline-0 text-sm",
        styles[variant || "primary"],
        disabled ? styles.disabled : "",
        className
      )}
      {...rest}
    >
      <span className="flex items-center justify-center gap-2">
        {startIcon}
        {children}
        {endIcon}
      </span>
    </button>
  );
};

export default Button;
