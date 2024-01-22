import { ReactElement, FC, ReactNode } from "react";
import Icon from "@options/components/common/icon/icon";
import Section from "@options/components/common/section/section";

type Props = {
  text?: string | ReactNode;
  error?: boolean;
};

const Toast: FC<Props> = ({ text = "Successfully Saved The Rule!", error = false }): ReactElement => {
  return (
    <Section classes={`py-3 bg-slate-800 rounded-xl bg-opacity-70 ${error ? "border-red-500" : "border-green-200"}`}>
      <div className="flex gap-2">
        <div className={`${error ? "text-red-500" : "text-green-200"}`}>
          <Icon name={error ? "xCircle" : "checkCircle"} />
        </div>
        <div className="w-full text-base text-center text-white">{text}</div>
      </div>
    </Section>
  );
};

export default Toast;
