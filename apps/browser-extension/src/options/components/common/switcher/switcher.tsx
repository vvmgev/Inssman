import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  error?: string;
  checked: boolean;
} & ComponentProps<"input">;

const Switcher = forwardRef(({ checked, disabled, error, ...rest }: Props, ref: any) => {
  const disabledClasses = disabled
    ? "cursor-not-allowed peer-checked:bg-gray-600  peer-checked:after:bg-gray-300 after:bg-gray-300"
    : "after:bg-white after:border-gray-300 peer-checked:after:border-white peer-checked:bg-sky-500";
  const errorClasses = error ? "border !border-red-500 after:bg-red-500" : "";

  return (
    <label className="relative inline-flex items-center cursor-pointer h-[24px]">
      <input type="checkbox" className="sr-only peer" disabled={disabled} checked={checked} ref={ref} {...rest} />
      <div
        className={twMerge(
          `w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full
        peer dark:bg-gray-700 peer-checked:after:translate-x-full
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`,
          disabledClasses,
          errorClasses
        )}
      ></div>
    </label>
  );
});

export default Switcher;
