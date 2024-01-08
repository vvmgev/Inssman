import { ReactElement, FC, ReactNode } from "react";
import CheckCircleSVG from "@assets/icons/checkCircle.svg";
import XCircleSVG from "@assets/icons/xCircle.svg";
import Section from "@options/components/common/section/section";

type Props = {
  text?: string | ReactNode;
  error?: boolean;
};

const Toast: FC<Props> = ({ text = "Successfully Saved The Rule!", error = false }): ReactElement => {
  return (
    <Section classes={`py-3 bg-opacity-70 ${error ? "border-red-500" : "border-sky-500"}`}>
      <div className="flex gap-2">
        <div className={`w-[24px] ${error ? "text-red-500" : "text-sky-500"}`}>
          {error ? <XCircleSVG /> : <CheckCircleSVG />}
        </div>
        <div className="w-full text-base text-center text-white">{text}</div>
      </div>
    </Section>
  );
};

export default Toast;
