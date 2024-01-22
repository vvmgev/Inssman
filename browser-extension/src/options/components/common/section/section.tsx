import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  classes?: string;
}> &
  ComponentProps<"div">;

const Section = ({ children, className = "", classes = "", ...rest }: Props) => {
  return (
    <div className={twMerge(`p-2 border border-slate-500 overflow-auto`, classes, className)} {...rest}>
      {children}
    </div>
  );
};

export default Section;
