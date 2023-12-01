import { ReactElement, useState, FC, useEffect, useRef } from "react";
import rrwebPlayer from 'rrweb-player';
import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import Button from "common/button/button";
import VideoCameraSVG  from 'assets/icons/videoCamera.svg'
import { PostMessageAction } from "models/postMessageActionModel";
import { RecordSession } from "src/models/recordSessionModel";
import 'rrweb-player/dist/style.css';
import { Link } from "react-router-dom";

const Record: FC = (): ReactElement => {
  const videoRef = useRef<rrwebPlayer>();
  const videoTagRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string>('https://google.com');
  const [session, setSession] = useState<RecordSession>();
  const startRecording = () => {
    chrome.runtime.sendMessage({ action: PostMessageAction.StartRecording, data: { url }});
  }

  useEffect(() => {
    chrome.runtime.sendMessage({
      action: PostMessageAction.GetLastRecordedSession},
      (session) => {
        if(session?.events?.length > 1) {
          setSession(session);
        }
      }
    );
  }, []);

  useEffect(() => {
    if(!videoRef.current && session) {
      videoRef.current = new rrwebPlayer({
        target: videoTagRef.current as HTMLElement,
        props: {
          width: 600,
          height: 400,
          events: session.events,
          showController: true,
          autoPlay: false
        },
      });
    }
  }, [session])


  const onChangeUrl = (event) => {
    setUrl(event.target.value)
  };

  return <ColorCover classes="flex justify-between mx-[5%] p-5">
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">Record Session & Replay</span>
        <span className="w-[24px] inline-block">{<VideoCameraSVG />}</span>
      </div>
      <div className="text-slate-400 leading-7">
        <p>Record all events in the browser and replay them with precise timing and interactions</p>
        <p>allowing to thoroughly test and debug web applications</p>
        <p>for optimal performance and user experience.</p>
      </div>
      <div className="mt-auto">
        <span className="font-bold">Note: </span>
        <span className="text-slate-400">All recorded sessions are stored on your device</span>
        <form className="flex gap-5 pt-5">
          <Input value={url} onChange={onChangeUrl} classes="w-2/3" placeholder="Enter URL e.g https://google.com"/>
          <Button onClick={startRecording} trackName="Start Recording">Start Recording</Button>
        </form>
      </div>
    </div>
    {session && <ColorCover classes="flex flex-col gap-5 rounded">
        <div className="flex justify-between">
          <span className="text-xl">Last Recorded Session</span>
          <Link to={`session/${session.id}`}>
            <Button trackName="Open Last Recorder Session">Open</Button>
          </Link>
        </div>
        <span className="text-slate-400 leading-7">
          <span className="font-bold text-slate-300">URL:  </span>
          <span> {session.url}</span>
          </span>
        <div ref={videoTagRef}></div>
      </ColorCover>
    }
  </ColorCover>
};

export default Record;
