import Header from "@/components/header/header";
import HTTPRulesList from "@/components/HTTPRulesList/HTTPRulesList";
import { TypewriterEffectSmooth } from "@/components/typewriter/typewriter";
import { Spotlight } from "@/components/typewriter/spotlight";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="h-[55rem] w-full dark:bg-black bg-white bg-grid-white/[0.2] relative flex items-center">
        <div className="flex flex-col gap-32 px-8">
          <Spotlight className="left-0 -top-40 md:left-90 md:-top-40" />
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex flex-col gap-2">
            <h1 className="z-20 flex text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 to-neutral-300">
              Intercept & Modify HTTP Requests
            </h1>
            <span className="relative z-20 flex gap-2 mt-3 text-xl text-transparent bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-600">
              Make Your Development and Testing
              <TypewriterEffectSmooth />
            </span>
          </div>
          <div className="flex flex-col justify-center w-full mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-start">
            <a
              className="relative flex items-center h-10 p-px px-4 py-2 space-x-2 text-sm no-underline transition duration-200 cursor-pointer text-slate-100 bg-sky-600 hover:bg-sky-400 w-36 font-semiboldtext-center ustify-center group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
              href="https://chromewebstore.google.com/detail/inssman-open-source-modif/ghlpdbkhlenlfiglgphledhfhchjfjfk?hl=en&authuser=0"
              target="_blank"
            >
              Add to Browser
            </a>
          </div>
        </div>
      </div>
      <HTTPRulesList />
    </div>
  );
}
