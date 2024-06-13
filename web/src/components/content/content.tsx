import HTTPRulesList from "@/components/HTTPRulesList/HTTPRulesList";
import Link from "next/link";
import Image from "next/image";
import GithubSVG from "../../app/github.svg";
import CheckCircleSVG from "../../app/checkCircle.svg";
import StarSVG from "../../app/star.svg";
import { TypewriterEffectSmooth } from "@/components/typewriter/typewriter";
import { Spotlight } from "@/components/typewriter/spotlight";

const Content = () => {
  return (
    <main>
      <div className="h-full w-full mt-24 dark:bg-black bg-white bg-grid-white/[0.2] relative flex items-center">
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
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> Block Request
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> Redirect URL (Script, Style, Iframe, Fetch,
              ...)
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> Modify HTTP Headers
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> Modify HTTP Payload
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> Modify HTTP Query Params
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> No Mock Server
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" /> No Registration, No Account
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" />
              <span className="text-transparent from-yellow-200 bg-gradient-to-r to-yellow-400 bg-clip-text">
                UNLIMITED
              </span>
              Rules
              <Image src={StarSVG} alt="" className="animate-ping-long" />
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" />
              <span className="text-transparent from-yellow-200 bg-gradient-to-r to-yellow-400 bg-clip-text">100%</span>
              Free To Use
              <Image src={StarSVG} alt="" className="animate-ping-long" />
            </li>
            <li className="flex gap-2">
              <Image src={CheckCircleSVG} className="dark:invert" alt="" />
              <span className="text-transparent from-yellow-200 bg-gradient-to-r to-yellow-400 bg-clip-text">100%</span>
              Open Source
              <Image src={StarSVG} alt="" className="animate-ping-long" />
            </li>
          </ul>
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
      <div className="mt-20">
        <HTTPRulesList />
      </div>
    </main>
  );
};

export default Content;
