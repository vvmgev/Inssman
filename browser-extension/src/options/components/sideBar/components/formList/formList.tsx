import { Link, useLocation } from "react-router-dom";
import ListSVG from "@assets/icons/list.svg";
import StarSVG from "@assets/icons/star.svg";
import { paths, popularPaths } from "../../../app/paths";
import Tooltip from "@options/components/common/tooltip/tooltip";

const FormList = () => {
  const location = useLocation();
  return (
    <ul>
      <li className="pl-2 mb-2">
        <Link to="/">
          <div
            className={`${location.pathname === "/" ? "text-sky-500" : ""} flex items-center hover:text-sky-500 gap-2`}
          >
            <span className="min-w-[24px]">{<ListSVG />}</span>
            <span className="whitespace-nowrap">All Rules</span>
          </div>
        </Link>
      </li>
      <li className="pl-2 mt-5 mb-2 text-slate-400">
        <div className="whitespace-nowrap">Create Rule</div>
      </li>
      {paths.map(({ icon, text, path }, index) => (
        <li className="pl-2 mb-2" key={index}>
          <Link to={`/create/${path}`}>
            <div
              className={`${
                location.pathname === `/create/${path}` ? "text-sky-500" : ""
              } flex items-center hover:text-sky-500 gap-2`}
            >
              <span className="min-w-[24px]">{icon}</span>
              <>
                <span className="whitespace-nowrap">{text}</span>
                {popularPaths.includes(path) && (
                  <Tooltip content="Popular">
                    <span className="w-[24px] inline-block text-yellow-400">{<StarSVG />}</span>
                  </Tooltip>
                )}
              </>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FormList;
