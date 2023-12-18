import { ReactElement, FC, useContext } from "react";
import VideoCameraSVG from "assets/icons/videoCamera.svg";
import SquaresSVG from "assets/icons/squares.svg";
import { Link, useLocation } from "react-router-dom";
import { FeatureToggleContext } from "src/context/featureToggleContext";

const Record: FC = (): ReactElement => {
  const location = useLocation();
  const { featureShowRecord } = useContext(FeatureToggleContext);
  return (
    <div>
      <div className="flex">
        <div className="pl-2 mb-2 text-slate-400">Record Session</div>
        {featureShowRecord ? (
          <sup className="text-xs inline-block bottom-4 text-red-500">
            &nbsp;Beta
          </sup>
        ) : (
          <sup className="text-xs inline-block bottom-4 text-sky-500">
            &nbsp;Coming Soon
          </sup>
        )}
      </div>
      <Link to={featureShowRecord ? "/record" : "#"}>
        <div
          className={`${
            location.pathname === "/record" ? "text-sky-500" : ""
          } flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}
        >
          <span className="w-[24px]">{<VideoCameraSVG />}</span>
          <span>Record</span>
        </div>
      </Link>
      <Link to={featureShowRecord ? "/record/session" : "#"}>
        <div
          className={`${
            location.pathname === "/record/session" ? "text-sky-500" : ""
          } flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}
        >
          <span className="w-[24px]">{<SquaresSVG />}</span>
          <span>Recorded Sessions</span>
        </div>
      </Link>
    </div>
  );
};

export default Record;
