import RCCheckbox, { CheckboxProps, CheckboxRef } from "rc-checkbox";
import { ComponentProps, ReactNode, forwardRef, useId } from "react";

type Props = {
  label?: string | ReactNode;
} & ComponentProps<"input"> &
  CheckboxProps &
  React.RefAttributes<CheckboxRef>;

const Checkbox = forwardRef(({ label, ...props }: Props, ref: any) => {
  const id = useId();
  return (
    <div className="flex items-center gap-1">
      <RCCheckbox {...props} id={id} ref={ref} />
      {label && (
        <label htmlFor={id} className="mr-3 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
