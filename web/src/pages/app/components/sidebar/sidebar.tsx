import Image from "next/image";
import Logo from "../../../../assets/icons/logo.svg";
import ListSVG from "../../../../assets/icons/list.svg";
import StarSVG from "../../../../assets/icons/star.svg";
import VideoCameraSVG from "../../../../assets/icons/videoCamera.svg";
import SquaresSVG from "../../../../assets/icons/squares.svg";
import Link from "next/link";
import Section from "../section/section";
import { paths, popularPaths, templates } from "./paths";
import Tooltip from "../tooltip/tooltip";

const SideBar = () => {
  const featureShowRecord = false;
  return (
    <Section classes="rounded-none h-full p-0 flex flex-col overflow-hidden">
      <Link className="hover:cursor-pointer" href="/">
        <div className="py-2 pl-2 border-b border-slate-700">
          <Image src={Logo} alt="logo" />
        </div>
      </Link>
      <div className="py-2 border-b border-slate-700">
        <ul>
          <li className="pl-2 mb-2">
            <Link href="/">
              <div
                className={`${
                  location.pathname === "/" ? "text-sky-500" : ""
                } flex items-center hover:text-sky-500 gap-2`}
              >
                <span className="min-w-[24px]">{<Image className="dark:invert" src={ListSVG} alt="list" />}</span>
                <span className="whitespace-nowrap">All Rules</span>
              </div>
            </Link>
          </li>
          <li className="pl-2 mt-5 mb-2 text-slate-400">
            <div className="whitespace-nowrap">Create Rule</div>
          </li>
          {paths.map(({ icon, text, path }, index) => (
            <li className="pl-2 mb-2" key={index}>
              <Link href={`/create/${path}`}>
                <div
                  className={`${
                    location.pathname === `/create/${path}` ? "text-sky-500" : ""
                  } flex items-center hover:text-sky-500 gap-2`}
                >
                  <span className="min-w-[24px] text-white">
                    <Image className="dark:invert" src={icon} alt="icon" />
                  </span>
                  <>
                    <span className="whitespace-nowrap">{text}</span>
                    {popularPaths.includes(path) && (
                      <Tooltip content="Popular">
                        <span className="w-[24px] inline-block text-yellow-400">
                          {<Image className="dark:invert" src={StarSVG} alt="popular" />}
                        </span>
                      </Tooltip>
                    )}
                  </>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${featureShowRecord ? "" : "py-2"} border-b border-slate-700`}>
        <div>
          <div className="pl-2 mb-2 text-slate-400 whitespace-nowrap">Record Session</div>
          <Link href={featureShowRecord ? "/record" : "#"}>
            <div
              className={`${
                location.pathname === "/record" ? "text-sky-500" : ""
              } flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}
            >
              <span className="min-w-[24px]">
                <Image className="dark:invert" src={VideoCameraSVG} alt="video camera" />
              </span>
              <span className="whitespace-nowrap">Record</span>
            </div>
          </Link>
          <Link href={featureShowRecord ? "/record/session" : "#"}>
            <div
              className={`${
                location.pathname === "/record/session" ? "text-sky-500" : ""
              } flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}
            >
              <span className="min-w-[24px]">
                <Image className="dark:invert" src={SquaresSVG} alt="square" />
              </span>
              <span className="whitespace-nowrap">Recorded Sessions</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="py-2 border-none">
        <ul>
          <li className="pl-2 mb-2 text-slate-400">
            <div>Templates</div>
          </li>
          {paths.map(({ icon, path }: any) => {
            const ruleTemplates: any = templates[path];
            if (!ruleTemplates) return null;
            return ruleTemplates.map((template: any) => {
              return (
                <li className="pl-2 mb-2" key={template.id}>
                  <Link href={`/template/${path}`}>
                    <div className="flex items-center gap-2 hover:text-sky-500">
                      <span className="min-w-[24px]">
                        <Image className="dark:invert" src={icon} alt="video camera" />
                      </span>
                      <span className="whitespace-nowrap">{template.name}</span>
                    </div>
                  </Link>
                </li>
              );
            });
          })}
        </ul>
      </div>
    </Section>
  );
};

export default SideBar;
