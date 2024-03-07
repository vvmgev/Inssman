import Image from "next/image";
import { PageType, paths } from "@/components/sidebar/paths";
import { cn } from "@/utils/cn";
import { FC } from "react";

type Props = {
  onClick: Function;
  activeIndex: number;
};

const Sidebar: FC<Props> = ({ onClick, activeIndex }) => {
  return (
    <ul className="flex flex-col gap-2">
      {paths.map(
        ({ icon, text, path }, index) =>
          path !== PageType.HTTP_LOGGER && (
            <li key={index} onClick={() => onClick(index)}>
              <div
                className={cn(
                  "flex items-center gap-2 cursor-pointer w-min px-2 py-1 rounded-xl text-slate-400 transition-all duration-200 ease-in-out sm:text-xs md:text-base",
                  activeIndex === index
                    ? "bg-white bg-opacity-20 text-slate-100"
                    : "hover:bg-white hover:bg-opacity-30 hover:text-slate-100"
                )}
              >
                <span className="min-w-[24px] text-white">
                  <Image className="dark:invert" src={icon} alt="icon" />
                </span>
                <>
                  <span className="whitespace-nowrap">{text}</span>
                </>
              </div>
            </li>
          )
      )}
    </ul>
  );
};

export default Sidebar;
