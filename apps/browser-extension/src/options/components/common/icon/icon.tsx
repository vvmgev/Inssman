import { ComponentProps, FC } from "react";
import { twMerge } from "tailwind-merge";
import * as Icons from "@assets/icons";

type Props = { name: Icons.IconName; className?: string } & ComponentProps<"span">;

const Icon: FC<Props> = ({ name, className = "" }) => {
  const SelectedIcon = Icons[name];
  return (
    <span className={twMerge("w-[24px] inline-block", className)}>
      <SelectedIcon />
    </span>
  );
};

export default Icon;
