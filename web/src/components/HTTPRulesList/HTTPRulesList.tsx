"use client";
import Sidebar from "./sidebar/sidebar";
import Content from "./content/content";
import BackgroundBox from "../backgroundBox/backgroundBox";
import { useState } from "react";

const HTTPRulesList = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <div className="relative">
      <BackgroundBox />
      <div className="pb-10 bg-gradient-to-br from-black via-transparent to-teal-500">
        <div className="flex justify-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 to-neutral-300">
          HTTP Rules List
        </div>
        <div className="mx-5 my-10 transition-all duration-200 ease-in-out bg-black border shadow-lg border-slate-300 border-opacity-20 bg-opacity-30 rounded-xl backdrop-blur-sm">
          <div className="flex w-full h-full">
            <div className="w-[20%] h-full">
              <div className="mt-5 ml-5">
                <Sidebar onClick={setActiveIndex} activeIndex={activeIndex} />
              </div>
            </div>
            <div className="w-[80%] h-full bg-white bg-opacity-10 p-5">
              <Content activeIndex={activeIndex} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTTPRulesList;
