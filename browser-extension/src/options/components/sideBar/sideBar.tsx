import Logo from "@assets/icons/logo.svg";
import Section from "../common/section/section";
import Tooltip from "@components/common/tooltip/tooltip";
import SkeletonAnimation from "../skeletonAnimation/skeletonAnimation";
import SidebarSection from "./components/sidebarSection/sidebarSection";
import SidebarItem from "./components/sidebarItem/sidebarItem";
import VideoCameraSVG from "@assets/icons/videoCamera.svg";
import SquaresSVG from "@assets/icons/squares.svg";
import ListSVG from "@assets/icons/list.svg";
import StarSVG from "@assets/icons/star.svg";
import { Link, useLocation } from "react-router-dom";
import { Fragment, useContext } from "react";
import { SideBarContext } from "@context/sideBarContext";
import { FeatureToggleContext } from "@context/featureToggleContext";
import { paths, popularPaths } from "../app/paths";
import { templates } from "../app/templates";

const SideBar = () => {
  const { full, setFull } = useContext(SideBarContext);
  const { featureShowRecord } = useContext(FeatureToggleContext);
  const AnimationElement = featureShowRecord ? SkeletonAnimation : Fragment;
  const location = useLocation();
  const templateId = location.state?.ruleMetaData?.id;
  return (
    <Section classes="rounded-none h-full p-0 flex flex-col overflow-hidden">
      <Link className="hover:cursor-pointer" to="/">
        <div className="py-2 pl-2 border-b border-slate-700">
          <Logo />
        </div>
      </Link>
      <div className="py-2 border-b border-slate-700">
        <SidebarSection>
          <SidebarItem title="All Rules" icon={<ListSVG />} url="/" />
        </SidebarSection>
        <SidebarSection title="Create Rule">
          {paths.map(({ icon, text, path }, index) => {
            const url = `/create/${path}`;
            return (
              <SidebarItem
                key={index}
                title={
                  <div className="flex items-center gap-1">
                    {text}
                    {popularPaths.includes(path) && (
                      <Tooltip content="Popular">
                        <span className="w-[24px] inline-block text-yellow-400">{<StarSVG />}</span>
                      </Tooltip>
                    )}
                  </div>
                }
                icon={icon}
                url={url}
                active={location.pathname === url}
              />
            );
          })}
        </SidebarSection>
      </div>
      <div className="border-b border-slate-700">
        <AnimationElement>
          <SidebarSection
            title={
              <div className="flex">
                <div className="text-slate-400 whitespace-nowrap">Record Session</div>
                {featureShowRecord ? (
                  <sup className="inline-block text-xs text-red-500 bottom-4 whitespace-nowrap">&nbsp;Beta</sup>
                ) : (
                  <sup className="inline-block text-xs bottom-4 text-sky-500 whitespace-nowrap">&nbsp;Coming Soon</sup>
                )}
              </div>
            }
          >
            <SidebarItem
              title="Record"
              icon={<VideoCameraSVG />}
              url={featureShowRecord ? "/record" : "#"}
              active={location.pathname === "/record"}
            />
            <SidebarItem
              title="Recorded Sessions"
              icon={<SquaresSVG />}
              url={featureShowRecord ? "/record/session" : "#"}
              active={location.pathname === "/record/session"}
            />
          </SidebarSection>
        </AnimationElement>
      </div>
      <div className="py-2 border-none">
        <SidebarSection title="Templates">
          {paths.map(({ icon, path }) => {
            const ruleTemplates = templates[path] || [];
            const url = `/template/${path}`;
            return ruleTemplates.map((template) => (
              <SidebarItem
                key={template.id}
                title={template.name}
                icon={icon}
                url={url}
                locationState={{ ruleMetaData: template, template: true }}
                active={template.id === templateId}
              />
            ));
          })}
        </SidebarSection>
      </div>
    </Section>
  );
};

export default SideBar;
