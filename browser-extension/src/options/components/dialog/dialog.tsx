import RCDialog, { DialogProps } from "rc-dialog";
import { FC, PropsWithChildren } from "react";
import "rc-dialog/assets/index.css";
import "./dialog.css";

type Props = PropsWithChildren<{
  classes?: DialogProps["classNames"];
}> &
  DialogProps;

const Dialog: FC<Props> = ({ children, classes, title, ...props }) => {
  return (
    <RCDialog
      title={<span className="text-slate-200 text-2xl">{title}</span>}
      classNames={{
        wrapper: `flex items-center backdrop-blur-[3px] ${classes?.wrapper || ""}`,
        body: `${classes?.body || ""}`,
        footer: `border-slate-700 ${classes?.footer || ""}`,
        header: `bg-transparent border-slate-700 text-2xl text-slate-200 ${classes?.header || ""}`,
        content: `bg-slate-800 bg-opacity-90 text-slate-200 text-2xl border-slate-700 shadow-sm shadow-slate-500 rounded-3xl ${
          classes?.header || ""
        }`,
        mask: `bg-transparent ${classes?.mask || ""}`,
      }}
      {...props}
    >
      {children}
    </RCDialog>
  );
};

export default Dialog;
