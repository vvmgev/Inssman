import ColorCover from "common/colorCover/colorCover";
import SessionPreview from "./components/sessionPreview/sessionPreview";
import ListSVG  from 'assets/icons/list.svg';
import SquaresSVG  from 'assets/icons/squares.svg';
import { FC, ReactElement, useEffect, useState } from "react";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { RecordSession } from "src/models/recordSessionModel";
import { Link } from "react-router-dom";

const SessionList: FC = (): ReactElement => {
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [sessions, setSessions] = useState<RecordSession[]>([]);
  const getSessions = (): void => chrome.runtime.sendMessage({action: PostMessageAction.GetRecordedSessions}, setSessions);

  useEffect(() => {
    getSessions();
  }, []);

  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex text-2xl justify-between">
      <div>Recorded Sessions</div>
      <div className="flex gap-1">
        <button onClick={() => setIsGrid(true)} className={`flex items-center rounded px-4 py-2 ${isGrid ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><SquaresSVG /></span>
        </button>
        <button onClick={() => setIsGrid(false)} className={`flex items-center rounded px-4 py-2 ${!isGrid ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><ListSVG /></span>
        </button>
      </div>
    </div>
    <div className="flex flex-row gap-2 mt-4">
      {sessions.map(session => (
        <div className="flex flex-row" key={session.id}>
          <Link to={String(session.id)}>
            <SessionPreview data={session} />
          </Link>
        </div>
      ))}
    </div>
  </ColorCover>
};

export default SessionList;
