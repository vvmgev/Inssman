import { FC, PropsWithChildren, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren<{
  title?: string | ReactElement;
  classes?: string;
}>;

const SidebarSection: FC<Props> = ({ title, children, classes = "" }) => {
  return (
    <div className={twMerge("border-b border-slate-500", classes)}>
      {title && <div className="m-2 text-slate-400">{title}</div>}
      <ul>{children}</ul>
    </div>
  );
};

export default SidebarSection;
