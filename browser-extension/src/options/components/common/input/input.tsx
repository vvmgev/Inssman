import RCInput, { InputProps, InputRef } from "rc-input";
import { forwardRef } from "react";

type Props = {
  error?: string | null;
  classes?: string;
};

const Input = forwardRef(
  (
    { onChange, classes, error, prefix, suffix, disabled, hidden, ...props }: InputProps & Props,
    ref: React.Ref<InputRef> | null
  ) => {
    return (
      <div className={`inline-block w-full relative ${classes || ""}`}>
        <div className="flex items-stretch">
          {prefix && (
            <div
              className={`pl-3 rounded-tl rounded-bl bg-slate-700/50 flex justify-center items-center
          ${error ? "border border-red-500 border-r-0" : ""}
        `}
            >
              {prefix}
            </div>
          )}
          <RCInput
            className={`drop-shadow-xl shadow-inner appearance-none bg-slate-700/50
                      rounded ${prefix ? "rounded-tl-none rounded-bl-none" : ""} ${
              prefix ? "rounded-tr-none rounded-br-none" : ""
            }
                      w-full p-3 leading-tight focus:outline-none focus:shadow-outline
                      ${error ? "border border-red-500" : ""}
                      ${error && prefix ? "border-l-0" : ""}
                      ${error && suffix ? "border-l-0" : ""}
                      ${disabled ? "cursor-not-allowed" : ""}
                      `}
            hidden={hidden}
            autoComplete="off"
            onChange={onChange}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div
              className={`pr-3 rounded-tr rounded-br bg-slate-700/50 flex justify-center items-center
          ${error ? "border border-red-500 border-r-0" : ""}
        `}
            >
              {suffix}
            </div>
          )}
        </div>
        <div className="absolute text-xs text-red-500 b-0 left-1">{error}</div>
      </div>
    );
  }
);

export default Input;
