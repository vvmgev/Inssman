import Link from "next/link";
import Icon from "@repo/ui/icon";
import Section from "../section/section";
import Tooltip from "../tooltip/tooltip";
import { paths, popularPaths, templates } from "./paths";

const Sidebar = () => {
  return (
    <Section classes="rounded-none h-full p-0 flex flex-col overflow-hidden">
      <Link className="hover:cursor-pointer" href="/app">
        <div className="py-2 pl-2 border-b border-slate-700">
          <Icon name="logo" />
        </div>
      </Link>
      <div className="py-2 border-b border-slate-700">
        <ul>
          <li className="pl-2 mb-2">
            <Link href="/app">
              <div className="flex items-center gap-2 hover:text-sky-500">
                <span className="min-w-[24px]">
                  <Icon name="list" />
                </span>
                <span className="whitespace-nowrap">All Rules</span>
              </div>
            </Link>
          </li>
          <li className="pl-2 mt-5 mb-2 text-slate-400">
            <div className="whitespace-nowrap">Create Rule</div>
          </li>
          {paths.map(({ icon, text, path }, index) => (
            <li className="pl-2 mb-2" key={index}>
              <Link href="/app">
                <div className="flex items-center gap-2 hover:text-sky-500">
                  <span className="min-w-[24px] text-white">{icon}</span>
                  <>
                    <span className="whitespace-nowrap">{text}</span>
                    {popularPaths.includes(path) && (
                      <Tooltip content="Popular">
                        <span className="w-[24px] inline-block text-yellow-400">
                          <Icon name="star" />
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
                  <Link href="/app">
                    <div className="flex items-center gap-2 hover:text-sky-500">
                      <span className="min-w-[24px]">{icon}</span>
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

export default Sidebar;
