import Logo from "assets/icons/logo.svg";
import ColorCover from "../common/colorCover/colorCover";
import TemplateList from "./templateList";
import FormList from "./components/formList/formList";
import Record from "./components/record/record";
import { useContext } from "react";
import { SideBarContext } from "src/context/sideBarContext";
import { Link } from "react-router-dom";
import ArrowLeftSVG from "assets/icons/arrowLeft.svg";
import ArrowRightSVG from "assets/icons/arrowRight.svg";

const SideBar = () => {
  const { full, setFull } = useContext(SideBarContext);
  return (
    <ColorCover classes="rounded-none h-full p-0 flex flex-col">
      <Link className="hover:cursor-pointer" to="/">
        <div className="pl-2 py-2 border border-slate-700">
          <Logo />
        </div>
      </Link>
      <div className="py-2 border border-slate-700">
        <FormList />
      </div>
      <div className="py-2 border border-slate-700">
        <Record />
      </div>
      <div className="py-2 border border-slate-700 border-b-0">
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
