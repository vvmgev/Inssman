import { ReactElement, FC } from "react";
import VideoCameraSVG  from 'assets/icons/videoCamera.svg'
import SquaresSVG  from 'assets/icons/squares.svg'
import { Link } from "react-router-dom";

const Record: FC = (): ReactElement => {
  return <div>
    <div className="pl-2 mb-2 text-slate-400">Record Session</div>
    <Link to="/record/session">
      <div className={`${location.pathname === '/record/session' ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}>
        <span className="w-[24px]">{<SquaresSVG />}</span><span>Recorded Sessions</span>
      </div>
    </Link>
    <Link to="/record">
      <div className={`${location.pathname === '/record' ? 'text-sky-500' : ''} flex items-center hover:text-sky-500 gap-2 pl-2 mb-2`}>
        <span className="w-[24px]">{<VideoCameraSVG />}</span><span>Record</span>
      </div>
    </Link>
  </div>
}


export default Record;
