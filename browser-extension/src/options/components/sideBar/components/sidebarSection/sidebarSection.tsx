import { FC, PropsWithChildren, ReactElement } from "react";

type Props = PropsWithChildren<{
  title?: string | ReactElement;
}>;

const SidebarSection: FC<Props> = ({ title, children }) => {
  return (
    <>
      {title && <div className="m-2 text-slate-400">{title}</div>}
      <ul>{children}</ul>
    </>
  );
};

export default SidebarSection;
