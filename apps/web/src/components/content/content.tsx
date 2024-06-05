import HTTPRulesList from "@/components/HTTPRulesList/HTTPRulesList";
import Link from "next/link";
import Icon from "@repo/ui/icon";
import { Button } from "@repo/ui/button";
import { TypewriterEffectSmooth } from "@/components/typewriter/typewriter";
import { Spotlight } from "@/components/typewriter/spotlight";

const Content = () => {
  return (
    <main>
      <div className="h-full w-full mt-32 dark:bg-black bg-white bg-grid-white/[0.2] relative flex items-center">
        <div className="flex flex-col gap-20 px-8">
          <Spotlight className="left-0 -top-40 md:left-90 md:-top-40" />
          <div className="absolute pointer-events-none inset-0 dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex flex-col gap-2">
            <h1 className="z-20 flex text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 to-neutral-300">
              Intercept & Modify HTTP Requests
            </h1>
            <span className="relative z-20 flex gap-2 mt-3 text-xl text-transparent bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-600">
              Make Your Development, Testing & Debugging
              <TypewriterEffectSmooth />
            </span>
          </div>
          <ul className="z-10 space-y-1.5 text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-800">
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> Block Request
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> Redirect URL (Script, Style, Iframe, Fetch, ...)
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> Modify HTTP Headers
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> Modify HTTP Payload
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> Modify HTTP Query Params
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> No Mock Server
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" /> No Registration, No Account
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" />
              <span className="text-transparent from-yellow-200 bg-gradient-to-r to-yellow-400 bg-clip-text">100%</span>
              Free To Use
              <Icon name="star" className="text-yellow-300 animate-ping-long" />
            </li>
            <li className="flex gap-2">
              <Icon name="checkCircle" className="text-neutral-400" />
              <span className="text-transparent from-yellow-200 bg-gradient-to-r to-yellow-400 bg-clip-text">100%</span>
              Open Source
              <Icon name="star" className="text-yellow-300 animate-ping-long" />
            </li>
          </ul>
          <div className="flex gap-5 text-sm">
            <Button className="z-10">
              <Link href="/docs/introduction" target="_blank">
                Get Started
              </Link>
            </Button>
            <Button className="z-10 p-2 rounded-xl" variant="outline">
              <Link href="https://github.com/vvmgev/Inssman" target="_blank" className="flex items-center gap-2">
                Source Code
                <Icon name="github" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <HTTPRulesList />
    </main>
  );
};

export default Content;
