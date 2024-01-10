import rrwebPlayer from "rrweb-player";
import PlayCircleSVG from "@assets/icons/playCircle.svg";
import TrashSVG from "@assets/icons/trash.svg";
import ShareSVG from "@assets/icons/share.svg";
import PlaySVG from "@assets/icons/play.svg";
import Section from "@options/components/common/section/section";
import Tooltip from "@options/components/common/tooltip/tooltip";
import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { RecordSession } from "@models/recordSessionModel";
import { Link } from "react-router-dom";

type Props = {
  data: RecordSession;
  onDelete: (data: RecordSession) => void;
};

const Session: FC<Props> = ({ data, onDelete }): ReactElement => {
  const [isHovered, setHovered] = useState(false);
  const [session, setSession] = useState<RecordSession>();
  const videoRef = useRef<rrwebPlayer>();

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  useEffect(() => {
    if (data.events.length > 1) {
      setSession(data);
    }
  }, [data]);

  const onHandleDelete = () => {
    onDelete(data);
  };

  return (
    <div>
      <Section classes="flex flex-col gap-3 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-ellipsis gap-4 max-w-[150px] whitespace-nowrap	overflow-hidden">
            <Tooltip content={data.url}>
              <span>{data.url}</span>
            </Tooltip>
          </div>
          <div className="flex gap-1">
            <Tooltip content="Play">
              <Link to={String(session?.id)}>
                <div className="cursor-pointer hover:text-sky-500">
                  <span className="w-[24px] inline-block">
                    <PlaySVG />
                  </span>
                </div>
              </Link>
            </Tooltip>
            <Tooltip content="Share (cooming soon)">
              <div className="cursor-pointer hover:text-sky-500">
                <span className="w-[24px] inline-block">
                  <ShareSVG />
                </span>
              </div>
            </Tooltip>
            <Tooltip content="Delete Recoreded Session">
              <div className="cursor-pointer hover:text-red-400" onClick={onHandleDelete}>
                <span className="w-[24px] inline-block">
                  <TrashSVG />
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to={String(session?.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {isHovered ? (
              <>
                <span className="bg-black bg-opacity-70 rounded-full group-hover:visible invisible w-[80px] z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <PlayCircleSVG />
                </span>
                <SessionPlayer
                  session={session}
                  playerOptions={{ width: 250, height: 200, showController: false }}
                  /* @ts-ignore */
                  ref={videoRef}
                />
              </>
            ) : (
              <div className="flex gap-2 w-[250px] h-[200px] items-center justify-center">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${session?.url}`}
                  onLoad={(event: any) => event.target.classList?.toggle("invisible")}
                  alt=""
                  className="invisible w-5 h-5"
                />
              </div>
            )}
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Session;
