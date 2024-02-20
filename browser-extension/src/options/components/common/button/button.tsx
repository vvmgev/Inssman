import TrackService from "@services/TrackService";
import { ReactNode, PropsWithChildren, FC, ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Size = "small" | "medium" | "large";
type Variant = "primary" | "secondary" | "icon" | "outline";
type ButtonVariant = Record<Variant | "disabled", string>;
type ButtonSize = Record<Size, string>;

type Props = PropsWithChildren<{
  trackName?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: Variant;
  className?: string;
  size?: Size;
  danger?: boolean;
}> &
  ComponentProps<"button">;

const buttonVariants: ButtonVariant = {
  primary: "bg-sky-600 hover:bg-sky-400 text-gray-100",
  secondary: "",
  outline: "border border-slate-500 text-slate-300 hover:border-sky-400 hover:text-sky-400",
  icon: "p-0",
  disabled:
    "text-slate-400 hover:text-slate-400 hover:border-slate-500 cursor-not-allowed bg-slate-600 hover:bg-slate-600",
};

const buttonSize: ButtonSize = {
  small: "text-xs px-2 py-1",
  medium: "text-sm px-3 py-2",
  large: "text-md px-4 py-3",
};

const Button: FC<Props> = ({
  trackName,
  children,
  onClick,
  className,
  startIcon,
  endIcon,
  disabled,
  variant = "primary",
  size = "small",
  type = "button",
  ...rest
}: Props) => {
  const handler = (event) => {
    if (trackName) {
      TrackService.trackEvent(trackName);
    }
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <button
      onClick={handler}
      disabled={disabled}
      type={type}
      className={twMerge(
        "rounded outline-0 inline-block",
        buttonSize[size],
        buttonVariants[variant],
        disabled ? buttonVariants.disabled : "",
        className
      )}
      {...rest}
    >
      <span className="flex items-center justify-center gap-1">
        {startIcon}
        {children}
        {endIcon}
      </span>
    </button>
  );
};

export default Button;
