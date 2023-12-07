import rrwebPlayer, { RRwebPlayerOptions } from "rrweb-player";
import { RecordSession } from "models/recordSessionModel";
import { FC, useEffect, useRef, forwardRef } from "react";
import './sessionPlayer.css';

type Props = {
  session: RecordSession | undefined,
  playerOptions?: Partial<RRwebPlayerOptions['props']>
}
const SessionPlayer: FC<Props> = forwardRef(({ session, playerOptions = {} }, ref: any) => {
  const videoRef = useRef<rrwebPlayer>();
  const videoTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player;
    if(!videoRef.current && session) {
      videoRef.current = new rrwebPlayer({
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
      if(ref) {
        ref.current = videoRef.current;
      }
    }

    return () => {
      // player?.$destroy?.();
    }
  }, [session, videoRef.current]);

  return <div ref={videoTagRef}></div>
})

export default SessionPlayer;
