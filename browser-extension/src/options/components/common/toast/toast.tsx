import { ReactElement, FC } from "react";
import CheckCircleSVG from "@assets/icons/checkCircle.svg";
import Section from "@options/components/common/section/section";

const Toast: FC = (): ReactElement => {
  return (
    <Section classes="py-3">
      <div className="flex gap-2">
        <div className="w-[24px] text-sky-500">
          <CheckCircleSVG />
        </div>
        <div className="text-base text-white">Successfully Saved The Rule!</div>
      </div>
    </Section>
  );
};

export default Toast;
