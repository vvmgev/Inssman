import { FC } from "react";
import * as Icons from "@assets/icons";

const Icon: FC<{ name: Icons.IconName }> = ({ name }) => {
  const SelectedIcon = Icons[name];
  return (
    <span className="w-[24px] inline-block">
      <SelectedIcon />
    </span>
  );
};

export default Icon;
