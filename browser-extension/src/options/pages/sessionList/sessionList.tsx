import { FC, ReactElement, useEffect, useState } from "react";
import ColorCover from "common/colorCover/colorCover";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { RecordSession } from "src/models/recordSessionModel";
import { Link } from "react-router-dom";
import Session from "./components/session/session";

const SessionList: FC = (): ReactElement => {
  const [sessions, setSessions] = useState<RecordSession[]>([]);
  const getSessions = (): void => chrome.runtime.sendMessage({action: PostMessageAction.GetRecordedSessions}, setSessions);

  useEffect(() => {
    getSessions();
  }, [])

  console.log('sessions', sessions);


  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex gap-5">SessionList</div>
    <div className="flex flex-col">
      {sessions.map(session => (
        <div className="flex flex-row" key={session.id}>
          <Link to={`${session.id}`}>
            <div className="w-[100px] h-[100px]">
              <Session data={session}/>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </ColorCover>
};

export default SessionList;
