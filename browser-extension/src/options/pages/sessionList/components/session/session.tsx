import rrwebPlayer from 'rrweb-player';
import { FC, ReactElement, useEffect, useRef } from "react";
import { RecordSession } from "src/models/recordSessionModel";

const Session: FC<{data: RecordSession}> = ({ data }): ReactElement => {
  const videoRef = useRef();
  const videoTagRef = useRef<any>();

  useEffect(() => {
    if(!videoRef.current && data.events.length > 1) {
      console.log(videoTagRef.current)
      // @ts-ignore
      videoRef.current = new rrwebPlayer({
        target: videoTagRef.current, // customizable root element
        props: {
          events: data.events,
          showController: true,
        },
      });
      // @ts-ignore
      // videoRef.current.play();
    }
  }, [])


  return <div ref={videoTagRef}></div>
};

export default Session;
