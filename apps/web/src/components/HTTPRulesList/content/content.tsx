import Image from "next/image";
import { paths } from "@/components/sidebar/paths";
import { FC } from "react";
import { HTTPRulesTypeInfo } from "./config";

type Props = {
  activeIndex: number;
};

const Content: FC<Props> = ({ activeIndex }) => {
  const { path } = paths[activeIndex];
  const activeRuleInfo: any = HTTPRulesTypeInfo[path];

  return (
    <div>
      <div className="flex flex-col gap-10">
        <div className="text-2xl break-all">{activeRuleInfo.title}</div>

        <Image
          className="w-3/4 border rounded shadow-lg opacity-80 border-slate-300 border-opacity-20"
          alt={activeRuleInfo.title}
          src={activeRuleInfo.image}
        />
        <div className="w-[35%]">
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-opacity-70 text-slate-300">{activeRuleInfo.description}</div>
              <div className="mt-10">
                <a
                  className="relative flex items-center h-10 p-px px-4 py-2 space-x-2 text-sm no-underline transition duration-200 cursor-pointer text-slate-100 bg-sky-600 hover:bg-sky-400 w-36 font-semiboldtext-center ustify-center group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
                  href={`/app/create/${path}`}
                  target="_blank"
                >
                  Create a Rule
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
