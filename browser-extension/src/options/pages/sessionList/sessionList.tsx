import { FC, ReactElement, useEffect, useState } from "react";
import ColorCover from "common/colorCover/colorCover";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { RecordSession } from "src/models/recordSessionModel";
import { Link } from "react-router-dom";

const SessionList: FC = (): ReactElement => {
  const [sessions, setSessions] = useState<RecordSession[]>([]);
  const getSessions = (): void => chrome.runtime.sendMessage({action: PostMessageAction.GetRecordedSessions}, setSessions);

  useEffect(() => {
    getSessions();
  }, [])

  console.log('sessions');
  console.log(sessions);


  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex gap-5">SessionList</div>
    <div className="flex flex-col">
      {sessions.map(session => (
        <div className="flex flex-row">
          <Link to={`${session.id}`}>
            <div className={`flex items-center hover:text-sky-500 gap-2`}>
              {session.url}
            </div>
          </Link>
        </div>
      ))}
    </div>
  </ColorCover>
};

export default SessionList;
