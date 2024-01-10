import RCDialog, { DialogProps } from "rc-dialog";
import { FC, PropsWithChildren } from "react";
import "rc-dialog/assets/index.css";
import "./dialog.css";

type Props = PropsWithChildren<{
  classes?: DialogProps["classNames"];
}> &
  DialogProps;

const Dialog: FC<Props> = ({ children, classes, ...props }) => {
  return (
    <RCDialog
      classNames={{
        wrapper: `flex items-center backdrop-blur-[3px] ${classes?.wrapper || ""}`,
        header: `bg-slate-800 text-slate-200 text-2xl border-slate-700 ${classes?.header || ""}`,
        body: `bg-slate-800 text-slate-200 text-2xl ${classes?.body || ""}`,
        footer: `bg-slate-800 text-slate-200 border-slate-700 ${classes?.footer || ""}`,
        mask: `bg-transparent ${classes?.mask || ""}`,
      }}
      {...props}
    >
      {children}
    </RCDialog>
  );
};

export default Dialog;
