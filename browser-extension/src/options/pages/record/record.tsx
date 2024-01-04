import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import Section from "@options/components/common/section/section";
import Input from "@options/components/common/input/input";
import Button from "@options/components/common/button/button";
import VideoCameraSVG from "@assets/icons/videoCamera.svg";
import { ReactElement, useState, FC, useEffect, useRef, memo } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { RecordSession } from "@models/recordSessionModel";
import { Link } from "react-router-dom";
import { InputRef } from "rc-input";
import { addProtocol } from "@utils/regExp";
import "rrweb-player/dist/style.css";

const Record: FC = (): ReactElement => {
  const searchRef = useRef<InputRef>(null);
  const [session, setSession] = useState<RecordSession>();
  const startRecording = () => {
    const url = addProtocol(searchRef.current?.input?.value || "");
    chrome.runtime.sendMessage({
      action: PostMessageAction.StartRecordingByUrl,
      data: { url },
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.GetLastRecordedSession,
      },
      (session) => {
        if (session?.events?.length > 1) {
          setSession(session);
        }
      }
    );
  }, []);

  return (
    <Section classes="flex justify-between mx-[5%] p-5">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <span className="w-[24px] inline-block">{<VideoCameraSVG />}</span>
            <span>Record Session & Replay</span>
          </div>
        </div>

        <div className="leading-7 text-slate-400">
          <p>Record all events in the browser and replay them with precise timing and interactions</p>
          <p>allowing to thoroughly test and debug web applications</p>
          <p>for optimal performance and user experience.</p>
        </div>
        <div className="mt-auto">
          <span className="font-bold">Note: </span>
          <span className="text-slate-400">All Recorded Sessions Are Stored On Your Device</span>
          <form className="flex gap-5 pt-5">
            <Input ref={searchRef} classes="w-2/3" placeholder="Enter URL e.g https://google.com" />
            <Button onClick={startRecording} trackName="Start Recording">
              Start Recording
            </Button>
          </form>
        </div>
      </div>
      {session && (
        <Section classes="ml-5 flex flex-col gap-5 rounded">
          <div className="flex justify-between">
            <span className="text-xl">Last Recorded Session</span>
            <Link to={`session/${session.id}`}>
              <Button trackName="Open Last Recorder Session">Open</Button>
            </Link>
          </div>
          <span className="flex gap-2 leading-7">
            <span className="font-bold text-slate-300">URL:</span>
            <span> {session.url}</span>
          </span>
          <SessionPlayer session={session} playerOptions={{ autoPlay: false }} />
        </Section>
      )}
    </Section>
  );
};

export default memo(Record);
