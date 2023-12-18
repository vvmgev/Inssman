import ColorCover from "common/colorCover/colorCover";
import SessionPlayer from "common/sessionPlayer/sessionPlayer";
import OutlineButton from "common/outlineButton/outlineButton";
import BackButton from "common/backButton/backButton";
import TrashSVG from "assets/icons/trash.svg";
import {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { useParams, useLocation } from "react-router-dom";
import { RecordSession } from "src/models/recordSessionModel";
import { SideBarContext } from "src/context/sideBarContext";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "src/utils";

const Session: FC = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<RecordSession>();
  const { setFull } = useContext(SideBarContext);
  const { id } = useParams();
  const sessionMemo = useMemo(() => session, [session]);
  const playerOptions = useMemo(
    () => ({ width: 800, height: 500, autoPlay: true }),
    []
  );

  useEffect(() => {
    setFull(false);

    return () => {
      setFull(true);
    };
  }, [location]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.GetRecordedSessionById,
        data: { id },
      },
      (session) => {
        if (session.events?.length > 1) {
          setSession(session);
        }
      }
    );
  }, []);

  const handleDelete = () => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRecordedSessionById,
        data: { id: session?.id },
      },
      () => navigate(-1)
    );
  };

  const getDuration = (session) => {
    try {
      const { minutes, seconds } = timeDifference(
        session.events[0].timestamp,
        session.events[session.events.length - 1].timestamp
      );
      return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
    } catch (error) {
      return "";
    }
  };

  return (
    <ColorCover classes="mx-[5%] p-5 flex flex-col gap-5">
      {session && (
        <>
          <div className="flex justify-between">
            <BackButton
              trackName="session"
              url="/record/session"
              text="Sessions"
            />
            <div className="text-xl capitalize">{session?.name}</div>
            <OutlineButton
              trackName="Delete Recorded Session in view mode"
              classes="hover:border-red-400 hover:text-red-400"
              onClick={handleDelete}
              icon={<TrashSVG />}
            >
              Delete
            </OutlineButton>
          </div>
          <div className="flex gap-5">
            <ColorCover classes="rounded flex gap-2 max-w-[300px]">
              <span className="text-slate-400">URL: </span>
              <span>{session.url}</span>
            </ColorCover>
            <ColorCover classes="rounded flex gap-2">
              <span className="text-slate-400">Recorded at: </span>
              <span>{session.date}</span>
            </ColorCover>
            <ColorCover classes="rounded flex gap-2">
              <span className="text-slate-400">Duraction: </span>
              <span>{getDuration(session)}</span>
            </ColorCover>
          </div>
        </>
      )}
      <div className="m-auto">
        <SessionPlayer session={sessionMemo} playerOptions={playerOptions} />
      </div>
    </ColorCover>
  );
};

export default Session;
