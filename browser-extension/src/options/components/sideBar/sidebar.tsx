import Section from "@components/common/section/section";
import Tooltip from "@components/common/tooltip/tooltip";
import SkeletonAnimation from "../skeletonAnimation/skeletonAnimation";
import Icon from "@options/components/common/icon/icon";
import SidebarSection from "./components/sidebarSection/sidebarSection";
import SidebarItem from "./components/sidebarItem/sidebarItem";
import { useLocation } from "react-router-dom";
import { Fragment, useContext } from "react";
import { FeatureToggleContext } from "@context/featureToggleContext";
import { paths, popularPaths } from "../app/paths";
import { templates } from "../app/templates";

const Sidebar = () => {
  const { featureShowRecord } = useContext(FeatureToggleContext);
  const AnimationElement = featureShowRecord ? SkeletonAnimation : Fragment;
  const location = useLocation();

  return (
    <Section classes="h-full p-0 flex flex-col overflow-y-auto">
      <SidebarSection classes="h-[70px] mt-2">
        <SidebarItem title={<Icon name="logo" />} icon={<></>} url="/" />
      </SidebarSection>
      <SidebarSection classes="border-none mt-2">
        <SidebarItem title="All Rules" icon={<Icon name="list" />} url="/" active={location.pathname === "/"} />
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
                      <div>
                        <Icon name="star" className="text-yellow-400" />
                      </div>
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
            icon={<Icon name="videoCamera" />}
            url={featureShowRecord ? "/record" : "#"}
            active={location.pathname === "/record"}
          />
          <SidebarItem
            title="Recorded Sessions"
            icon={<Icon name="squares" />}
            url={featureShowRecord ? "/record/session" : "#"}
            active={location.pathname === "/record/session"}
          />
        </SidebarSection>
      </AnimationElement>
      <div className="py-2 border-none">
        <SidebarSection title="Templates" classes="border-none">
          {paths.map(({ icon, path }) => {
            const ruleTemplates = templates[path] || [];
            return ruleTemplates.map((template, index) => (
              <SidebarItem
                key={template.id}
                title={template.name}
                icon={icon}
                locationState={{ template: true, index }}
                url={`/template/${path}/${template.id}`}
                active={location.pathname === `/template/${path}/${template.id}`}
              />
            ));
          })}
        </SidebarSection>
      </div>
    </Section>
  );
};

export default Sidebar;
