import { ReactElement, useState, FC, useEffect, useRef } from "react";
import rrwebPlayer from 'rrweb-player';
import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import Button from "common/button/button";
import VideoCameraSVG  from 'assets/icons/videoCamera.svg'
import { PostMessageAction } from "models/postMessageActionModel";
import 'rrweb-player/dist/style.css';

const Record: FC = (): ReactElement => {
  const videoRef = useRef();
  const videoTagRef = useRef<any>();
  const [url, setUrl] = useState<string>('https://google.com');
  const [video, setVideo] = useState<Array<any>>();
  const startRecording = () => {
    chrome.runtime.sendMessage({ action: PostMessageAction.StartRecording, data: { url }});
  }

  useEffect(() => {
    chrome.runtime.sendMessage({
      action: PostMessageAction.GetRecordedSessions},
      (recordedSessions) => {
        console.log('inssman recordedSessions', recordedSessions)
        setVideo(recordedSessions);
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


  const onChangeUrl = (event) => {
    setUrl(event.target.value)
  };

  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">Record Session & Replay</span>
        <span className="w-[24px] inline-block">{<VideoCameraSVG />}</span></div>
      <div className="text-slate-400">
        <p>Record all events in the browser and replay them with precise timing and interactions</p>
        <p>allowing to thoroughly test and debug web applications</p>
        <p>for optimal performance and user experience.</p>
      </div>
      <div>
        <span className="font-black">Note: </span>
        <span className="text-slate-400">All recorded sessions are stored on your device</span>
      </div>
      <div className="flex gap-5">
        <Input value={url} onChange={onChangeUrl} classes="w-1/3" placeholder="Enter URL e.g https://google.com"/>
        <Button onClick={startRecording} trackName="Start Recording">Start Recording</Button>
      </div>
    </div>
    <div ref={videoTagRef}></div>
  </ColorCover>
};

export default Record;
