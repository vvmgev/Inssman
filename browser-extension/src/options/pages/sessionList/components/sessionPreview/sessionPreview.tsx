import rrwebPlayer from "rrweb-player";
import PlayCircleSVG  from 'assets/icons/playCircle.svg';
import TrashSVG  from 'assets/icons/trash.svg';
import ColorCover from "src/options/components/common/colorCover/colorCover";
import Tooltip from 'common/tooltip/tooltip';
import SessionPlayer from "common/sessionPlayer/sessionPlayer";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { RecordSession } from "src/models/recordSessionModel";

type Props = {
  data: RecordSession,
  onDelete: (data: RecordSession) => void
}

const Session: FC<Props> = ({ data, onDelete }): ReactElement => {
  const videoRef = useRef<rrwebPlayer>();
  const [session, setSession] = useState<RecordSession>();

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  useEffect(() => {
    if(data.events.length > 1) {
      setSession(data);
    }
  }, [data]);


  const onHandleDelete = (event) => {
    event.preventDefault();
    onDelete(data);
  }

  return <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <ColorCover classes="flex flex-col gap-3 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="text-ellipsis w-[200px] whitespace-nowrap	overflow-hidden">{data.url}</div>
        <div>
          <Tooltip
            content='Delete Recoreded Session'>
              <div className="cursor-pointer hover:text-red-400" onClick={onHandleDelete}><span className="w-[24px] inline-block"><TrashSVG /></span></div>
          </Tooltip>
        </div>
      </div>
      <div className="relative group">
        <span className="bg-black bg-opacity-70 rounded-full group-hover:visible invisible w-[80px] z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"><PlayCircleSVG /></span>
        {/* @ts-ignore */}
        <SessionPlayer session={session} playerOptions={{width: 250, height: 200, showController: false}} ref={videoRef}/>
      </div>
    </ColorCover>
  </div>
};

export default Session;
