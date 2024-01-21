import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  classes?: string;
}>;

const Section = ({ children, classes = "" }: Props) => {
  return (
    <div className={twMerge(`p-2 drop-shadow-xl shadow-inner border border-slate-500 overflow-auto`, classes)}>
      {children}
    </div>
  );
};

export default Section;
