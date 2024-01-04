import { ReactElement, FC, ReactNode } from "react";
import CheckCircleSVG from "@assets/icons/checkCircle.svg";
import Section from "@options/components/common/section/section";

type Props = {
  text?: string | ReactNode;
};

const Toast: FC<Props> = ({ text = "Successfully Saved The Rule!" }): ReactElement => {
  return (
    <Section classes="py-3 bg-opacity-70 border-sky-500">
      <div className="flex gap-2">
        <div className="w-[24px] text-sky-500">
          <CheckCircleSVG />
        </div>
        <div className="w-full text-base text-center text-white">{text}</div>
      </div>
    </Section>
  );
};

export default Toast;
