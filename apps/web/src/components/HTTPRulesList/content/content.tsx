import Image from "next/image";
import { paths } from "@/components/sidebar/paths";
import { FC } from "react";
import { HTTPRulesTypeInfo } from "./config";
import { Button } from "@repo/ui/button";

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
                <Button>
                  <a href={`/app/create/${path}`} target="_blank">
                    Create a Rule
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
