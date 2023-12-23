import Logo from "@assets/icons/logo.svg";
import ColorCover from "../common/colorCover/colorCover";
import TemplateList from "./templateList";
import FormList from "./components/formList/formList";
import Record from "./components/record/record";
import { Fragment, useContext } from "react";
import { SideBarContext } from "@context/sideBarContext";
import { Link } from "react-router-dom";
import ArrowLeftSVG from "@assets/icons/arrowLeft.svg";
import ArrowRightSVG from "@assets/icons/arrowRight.svg";
import SkeletonAnimation from "../skeletonAnimation/skeletonAnimation";
import { FeatureToggleContext } from "@context/featureToggleContext";

const SideBar = () => {
  const { full, setFull } = useContext(SideBarContext);
  const { featureShowRecord } = useContext(FeatureToggleContext);
  const AnimationElement = featureShowRecord ? SkeletonAnimation : Fragment;
  return (
    <ColorCover
      classes={`rounded-none h-full p-0 flex flex-col overflow-hidden ${
        full ? "" : ""
      }`}
    >
      <Link className="hover:cursor-pointer" to="/">
        <div className="pl-2 py-2 border-b border-slate-700">
          <Logo />
        </div>
      </Link>
      <div className="py-2 border-b border-slate-700">
        <FormList />
      </div>
      <div
        className={`${
          featureShowRecord ? "" : "py-2"
        } border-b border-slate-700`}
      >
        <AnimationElement>
          <Record />
        </AnimationElement>
      </div>
      <div className="py-2 border-none">
        <TemplateList />
      </div>
      {/* <div className="py-2 border border-slate-700 flex flex-col flex-1 justify-end">
        <div
          className="cursor-pointer flex items-center hover:text-sky-500 gap-2 pl-2 mb-2"
          onClick={() => setFull(!full)}
        >
          <span className="w-[24px]">
            {full ? <ArrowLeftSVG /> : <ArrowRightSVG />}
          </span>
          {full && <span>Collapse</span>}
        </div>
      </div> */}
    </ColorCover>
  );
};

export default SideBar;
