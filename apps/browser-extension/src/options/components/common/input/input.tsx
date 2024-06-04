import RCInput, { InputProps, InputRef } from "rc-input";
import { ReactNode, forwardRef } from "react";

type Props = {
  error?: string | null;
  classes?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
} & InputProps;

const Input = forwardRef(
  (
    { onChange, classes, error, startIcon, endIcon, disabled, hidden, ...props }: Props,
    ref: React.Ref<InputRef> | null
  ) => {
    return (
      <div className={`inline-block w-full relative ${classes || ""}`}>
        <div className="flex items-stretch">
          {startIcon && (
            <div
              className={`pl-3 rounded-tl rounded-bl bg-slate-700/50 flex justify-center items-center
          ${error ? "border border-red-500 border-r-0" : ""}
        `}
            >
              {startIcon}
            </div>
          )}
          <RCInput
            className={`drop-shadow-xl shadow-inner appearance-none bg-slate-700/50
                      rounded ${startIcon ? "rounded-tl-none rounded-bl-none" : ""} ${
              startIcon ? "rounded-tr-none rounded-br-none" : ""
            }
                      w-full p-3 leading-tight focus:outline-none focus:shadow-outline
                      ${error ? "border border-red-500" : ""}
                      ${error && startIcon ? "border-l-0" : ""}
                      ${error && endIcon ? "border-l-0" : ""}
                      ${disabled ? "cursor-not-allowed text-slate-500 placeholder:text-slate-500 bg-slate-700/70" : ""}
                      `}
            hidden={hidden}
            autoComplete="off"
            onChange={onChange}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div
              className={`pr-3 rounded-tr rounded-br bg-slate-700/50 flex justify-center items-center
          ${error ? "border border-red-500 border-r-0" : ""}
        `}
            >
              {endIcon}
            </div>
          )}
        </div>
        <div className="absolute text-xs text-red-500 b-0 left-1">{error}</div>
      </div>
    );
  }
);

export default Input;
