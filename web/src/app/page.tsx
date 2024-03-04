import Image from "next/image";
import Logo from "../../../browser-extension/src/assets/images/icons/inssman_big.png";
import GithubSVG from "./github.svg";
import DocumentSVG from "./document.svg";
import { TypewriterEffectSmooth } from "@/components/typewriter/typewriter";
import { Spotlight } from "@/components/typewriter/spotlight";

export default function Home() {
  return (
    <div>
      <header className="z-[50] fixed top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]">
        <div className="container flex h-16 items-center max-w-[88rem] mx-auto">
          <div className="cursor-pointer">
            <Image alt="Inssman" src={Logo} className="w-[200px]" />
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium xl:flex">
            {/* <a
              className="hidden transition-colors hover:text-foreground/80 text-foreground/60 sm:block"
              href="/components"
            >
              Components
            </a> */}
          </nav>
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-2 md:justify-end">
            <a
              target="__blank"
              className="mr-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              href="https://github.com/vvmgev/Inssman"
            >
              <span className="flex items-center gap-2">
                <Image alt="Inssman Github" src={GithubSVG} />
                Github
              </span>
            </a>
            <a
              className="relative flex items-center h-10 p-px px-4 py-2 space-x-2 text-sm text-white no-underline transition duration-200 cursor-pointer w-36 font-semiboldtext-center ustify-center bg-slate-900 dark:bg-white dark:text-black group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
              href="https://chromewebstore.google.com/detail/inssman-open-source-modif/ghlpdbkhlenlfiglgphledhfhchjfjfk?hl=en&authuser=0"
              target="_blank"
            >
              Add to Browser
            </a>
          </div>
        </div>
      </header>
      <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center">
        <div className="flex flex-col gap-32 px-8">
          <div>
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
          </div>
          <div className="flex flex-col justify-center w-full mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-start">
            <a
              className="relative flex items-center p-px px-4 py-2 space-x-2 text-sm font-semibold text-center text-white no-underline transition duration-200 cursor-pointer w-36 ustify-center bg-slate-900 dark:bg-white dark:text-black group hover:shadow-2xl shadow-zinc-900 h-14 rounded-2xl"
              href="https://chromewebstore.google.com/detail/inssman-open-source-modif/ghlpdbkhlenlfiglgphledhfhchjfjfk?hl=en&authuser=0"
              target="_blank"
            >
              Add to Browser
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main
      className="w-full h-[100vh] bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
    text-gray-300 text-sm relative"
    >
      <div className="absolute top-0 left-0">
        <div
          className={`p-2 rounded-3xl rounded-tl-none rounded-bl-none rounded-tr-none bg-slate-800 bg-opacity-40 drop-shadow-xl
            shadow-inner border border-slate-700 overflow-auto`}
        >
          <Image alt="Inssman" src={Logo} className="w-[300px]" />
        </div>
      </div>
      <div className="absolute top-0 right-0">
        <div className="bg-slate-800 bg-opacity-40 drop-shadow-xl rounded-3xl rounded-tl-none rounded-br-none rounded-tr-none shadow-inner border border-slate-700 overflow-auto flex gap-5 p-5 w-[initial]">
          <a
            target="_blank"
            href="https://github.com/vvmgev/Inssman"
            className="flex items-center gap-3 hover:text-sky-500"
          >
            <span className="w-[24px] text-white">
              {/* @ts-ignore */}
              <Image alt="Inssman Github" src={GithubSVG} />
            </span>
            Github
          </a>
          <a
            target="_blank"
            href="https://github.com/vvmgev/Inssman#documentation"
            className="flex items-center gap-3 hover:text-sky-500"
          >
            <span className="w-[24px] text-white">
              <Image alt="Inssman Documentation" className="text-white" src={DocumentSVG} />
            </span>
            Docs
          </a>
        </div>
      </div>

      <div className="absolute top-[50%] left-[50%] text-center text-6xl -translate-x-2/4 -translate-y-2/4">
        <h1>COMING SOON 😍</h1>
        <hr />
        <div className="flex flex-col gap-2 mt-10 text-xl">
          <div className="flex flex-row items-center justify-center gap-2">
            <a
              target="_blank"
              href="https://chromewebstore.google.com/detail/inssman-open-source-modif/ghlpdbkhlenlfiglgphledhfhchjfjfk"
              className="hover:text-sky-500"
            >
              Download the extension for Google Chrome
            </a>
            <span className="w-5">
              <img
                alt="Chrome logo"
                src="https://github.com/vvmgev/Inssman/assets/11613729/338e9918-3a5a-45e6-96f5-6b0c1fdd94d7"
              />
            </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <a
              target="_blank"
              href="https://microsoftedge.microsoft.com/addons/detail/inssman-opensource-mod/obibnmkbiilpbkhpkoagnkkjlghlndpf"
              className="hover:text-sky-500"
            >
              Download the extension for Microsoft Egde
            </a>
            <span className="w-5">
              <img
                alt="Microsoft Edge logo"
                src="https://github.com/vvmgev/Inssman/assets/11613729/c15a2d97-a43c-4924-b7f1-6ba7992b9ae3"
              />
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
