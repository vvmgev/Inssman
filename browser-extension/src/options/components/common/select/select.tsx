import RCSelect, { Option, SelectProps } from "rc-select";
import "rc-select/assets/index.css";
import "./select.css";
import { forwardRef } from "react";

type Props = {
  name: string;
  error?: any;
  classes?: string;
};

const Select = forwardRef(
  (
    {
      value,
      name,
      options,
      onChange,
      error,
      placeholder,
      mode,
      classes = "",
      showSearch = false,
      ...rest
    }: SelectProps & Props,
    ref: any
  ) => {
    const changeHandler = (value) => {
      // @ts-ignore
      onChange({
        target: {
          name,
          value,
        },
      });
    };
    const config: Pick<SelectProps, "mode"> = {};
    if (mode) {
      config.mode = mode;
    }

    return (
      <div className={`inline-block w-full py-2 min-w-[100px] relative ${classes}`}>
        <RCSelect
          {...config}
          {...rest}
          showSearch={showSearch}
          className={`w-full capitalize pl-1 py-2 rounded focus:outline-none active:outline-none outline-none focus:shadow-none bg-slate-700/70
        ${error ? "border border-red-500" : "focus:border-none"}
        ${mode ? "select-tags" : ""}`}
          dropdownClassName="bg-slate-700/70 my-1 text-slate-200 border-none"
          placeholder={placeholder}
          value={value}
          maxTagCount={3}
          onChange={changeHandler}
          removeIcon={<span className="ml-2 cursor-pointer bold">X</span>}
          ref={ref}
        >
          {options?.map((item, id) => {
            return (
              <Option
                className="pl-1 text-xs capitalize cursor-pointer bg-slate-700/70 hover:bg-sky-500"
                key={id}
                value={item.value}
              >
                {item.label}
              </Option>
            );
          })}
        </RCSelect>
        <div className="absolute text-xs text-red-500 left-1 b-0">{error}</div>
      </div>
    );
  }
);

export default Select;
