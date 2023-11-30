import rrwebPlayer from "rrweb-player";
import PlayCircleSVG  from 'assets/icons/playCircle.svg';
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { RecordSession } from "src/models/recordSessionModel";
import ColorCover from "src/options/components/common/colorCover/colorCover";

const Session: FC<{data: RecordSession}> = ({ data }): ReactElement => {
  const videoRef = useRef<rrwebPlayer>();
  const videoTagRef = useRef<any>();
  const [video, setVideo] = useState<Array<any>>();

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  useEffect(() => {
    if(data.events.length > 1) {
      setVideo(data.events);
    }
  }, [data]);

  useEffect(() => {
    if(!videoRef.current && video) {
      videoRef.current = new rrwebPlayer({
        target: videoTagRef.current as HTMLDivElement,
        props: {
          width: 300,
          height: 185,
          events: video,
          autoPlay: false,
          showController: false,
        },
      });
    }
  }, [video]);

  return <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <ColorCover classes="flex flex-col gap-3 rounded-xl group">
      <div>{data.url}</div>
      <div className="relative">
        <span className="text-sky-500 group-hover:visible invisible w-[80px] z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"><PlayCircleSVG /></span>
        <div ref={videoTagRef}></div>
      </div>
    </ColorCover>
  </div>
};

export default Session;
