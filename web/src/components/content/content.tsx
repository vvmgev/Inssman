import HTTPRulesList from "@/components/HTTPRulesList/HTTPRulesList";
import Link from "next/link";
import Image from "next/image";
import GithubSVG from "../../app/github.svg";
import { TypewriterEffectSmooth } from "@/components/typewriter/typewriter";
import { Spotlight } from "@/components/typewriter/spotlight";

console.log(typeof process !== "undefined" && process?.env);

const Content = () => {
  return (
    <main>
      <div className="h-screen w-full dark:bg-black bg-white bg-grid-white/[0.2] relative flex items-center">
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
          <div className="flex gap-5 text-sm">
            <Link
              className="relative flex items-center justify-center h-10 p-4 text-center no-underline transition duration-200 cursor-pointer text-slate-100 bg-sky-600 hover:bg-sky-400 ustify-center group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
              href="/docs/introduction"
              target="_blank"
            >
              Get Started
            </Link>
            <Link
              className="relative flex items-center justify-center h-10 gap-2 p-4 text-center no-underline transition duration-200 border cursor-pointer text-slate-100 border-slate-300/50 ustify-center group hover:shadow-2xl shadow-zinc-900 hover:bg-gray-900 rounded-2xl"
              href="https://github.com/vvmgev/Inssman"
              target="_blank"
            >
              <Image alt="Inssman Github" src={GithubSVG} />
              Github
            </Link>
          </div>
        </div>
      </div>
      <HTTPRulesList />
    </main>
  );
};

export default Content;
