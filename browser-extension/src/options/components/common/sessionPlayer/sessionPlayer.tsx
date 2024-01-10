import Replayer, { RRwebPlayerOptions } from "rrweb-player";
import { RecordSession } from "@models/recordSessionModel";
import { FC, useEffect, useRef, forwardRef, memo } from "react";
import { htmlToImage } from "@utils/htmlToImage";
import "./sessionPlayer.css";

type Props = {
  session: RecordSession | undefined;
  playerOptions?: Partial<RRwebPlayerOptions["props"]>;
};
const SessionPlayer: FC<Props> = forwardRef(({ session, playerOptions = {} }, ref: any) => {
  const videoRef = useRef<Replayer>();
  const videoTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player;
    if (!videoRef.current && session) {
      videoRef.current = new Replayer({
        target: videoTagRef.current as HTMLDivElement,
        props: {
          events: session.events,
          width: 450,
          height: 285,
          autoPlay: false,
          showController: true,
          triggerFocus: false,
          ...playerOptions,
        },
      });
      player = videoRef.current;
      if (ref) {
        ref.current = videoRef.current;
      }
    }

    return () => {
      player?.$destroy?.();
    };
  }, [session, videoRef.current]);

  useEffect(() => {
    if (!session || !videoRef.current) return;

    setTimeout(() => {
      const element: any = document?.getElementById?.("root");
      if (element) {
        htmlToImage(element).then(console.log).catch(console.log);
      }
    }, 3000);
  }, [session, videoRef.current]);

  return <div id="asa" ref={videoTagRef}></div>;
});

export default memo(SessionPlayer);
