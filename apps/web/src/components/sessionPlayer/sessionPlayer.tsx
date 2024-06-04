import Replayer, { RRwebPlayerOptions } from "rrweb-player";
import { FC, useEffect, useRef, forwardRef, memo } from "react";
import "rrweb-player/dist/style.css";
import "./sessionPlayer.css";

type Props = {
  session: any;
  playerOptions?: Partial<RRwebPlayerOptions["props"]>;
};
const SessionPlayer: FC<Props> = forwardRef(({ session, playerOptions = {} }, ref: any) => {
  const videoRef = useRef<Replayer>();
  const videoTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: any;
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

  return <div ref={videoTagRef}></div>;
});

SessionPlayer.displayName = "SessionPlayer";

export default memo(SessionPlayer);
