import { FC, ReactElement, useEffect, useRef, useState } from "react";
import ColorCover from "common/colorCover/colorCover";
import { PostMessageAction } from "src/models/postMessageActionModel";

const Session: FC = (): ReactElement => {
  const videoRef = useRef();
  const videoTagRef = useRef<any>();
  const [video, setVideo] = useState<Array<any>>();

  useEffect(() => {
    chrome.runtime.sendMessage({
      action: PostMessageAction.GetRecordedSessionById},
      (recordedSessions) => {
        if(recordedSessions.length > 1) {
          setVideo(recordedSessions);
        }
      }
    );
  }, []);

  useEffect(() => {
    if(!videoRef.current && video) {
      console.log('videoTagRef.current')
      console.log(videoTagRef.current)
      // @ts-ignore
      videoRef.current = new rrwebPlayer({
        target: videoTagRef.current, // customizable root element
        props: {
          // @ts-ignore
          events: video,
          showController: true,
        },
      });
      // @ts-ignore
      videoRef.current.play();
    }
  }, [video])


  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex gap-5">session</div>
    <div ref={videoTagRef}></div>
  </ColorCover>
};

export default Session;
