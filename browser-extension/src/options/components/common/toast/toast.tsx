import { ReactElement, FC } from "react";
import CheckCircleSVG from "assets/icons/checkCircle.svg";
import ColorCover from "components/common/colorCover/colorCover";

const Toast: FC = (): ReactElement => {
  return (
    <ColorCover classes="py-3">
      <div className="flex gap-2">
        <div className="w-[24px] text-sky-500">
          <CheckCircleSVG />
        </div>
        <div className="text-base">Successfully Saved The Rule!</div>
      </div>
    </ColorCover>
  );
};

export default Toast;
