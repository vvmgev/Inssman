import { FC, ReactElement, useContext, useEffect, useRef, useState } from "react";
import ColorCover from "common/colorCover/colorCover";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { useParams } from "react-router-dom";
import rrwebPlayer from "rrweb-player";
import { RecordSession } from "src/models/recordSessionModel";
import { useLocation } from 'react-router-dom';
import { SideBarContext } from "src/context/sideBarContext";


const Session: FC = (): ReactElement => {
  const location = useLocation()
  const videoRef = useRef<rrwebPlayer>();
  const videoTagRef = useRef<any>();
  const [session, setSession] = useState<RecordSession>();
  const { setFull } = useContext(SideBarContext);
  const { id } = useParams();

  useEffect(() => {
    setFull(false);

    return () => {
      setFull(true);
    }
  }, [location])


  useEffect(() => {
    chrome.runtime.sendMessage({
      action: PostMessageAction.GetRecordedSessionById, data: { id }},
      (session) => {
        if(session.events.length > 1) {
          setSession(session);
        }
      }
    );
  }, []);

  useEffect(() => {
    if(!videoRef.current && session) {
      videoRef.current = new rrwebPlayer({
        target: videoTagRef.current,
        props: {
          events: session.events,
          showController: true,
          autoPlay: false,
        },
      });
    }
  }, [session])

  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex gap-5">session</div>
    <div ref={videoTagRef}></div>
  </ColorCover>
};

export default Session;
