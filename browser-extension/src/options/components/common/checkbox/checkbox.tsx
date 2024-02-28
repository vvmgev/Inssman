import RCCheckbox, { CheckboxProps, CheckboxRef } from "rc-checkbox";
import { ComponentProps, forwardRef, useId } from "react";

type Props = {
  label?: string;
} & ComponentProps<"input"> &
  CheckboxProps &
  React.RefAttributes<CheckboxRef>;

const Checkbox = forwardRef(({ label, ...props }: Props, ref: any) => {
  const id = useId();
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      <RCCheckbox {...props} id={id} ref={ref} />
      {label && (
        <label htmlFor={id} className="mr-3">
          {label}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
