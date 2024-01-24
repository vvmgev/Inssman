import Replayer, { RRwebPlayerOptions } from "rrweb-player";
import { RecordSession } from "@models/recordSessionModel";
import { FC, useEffect, useRef, forwardRef, memo, useState } from "react";
import "./sessionPlayer.css";

type Props = {
  session: RecordSession | undefined;
  playerOptions?: Partial<RRwebPlayerOptions["props"]>;
};
const SessionPlayer: FC<Props> = forwardRef(({ session, playerOptions = {} }, ref: any) => {
  const playerRef = useRef<Replayer>();
  const playerTagRef = useRef<HTMLDivElement>(null);
  const [validVideo, setValidVideo] = useState<boolean>(true);

  useEffect(() => {
    let player;
    if (!playerRef.current && playerTagRef.current && session && session.events?.length >= 2) {
      playerRef.current = new Replayer({
        target: playerTagRef.current as HTMLDivElement,
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
      player = playerRef.current;
      if (ref) {
        ref.current = playerRef.current;
      }
    }
    setValidVideo(!!(session && session.events?.length >= 2));

    return () => {
      player?.$destroy?.();
    };
  }, [session, playerRef.current, playerTagRef.current, validVideo]);

  return (
    <>{validVideo ? <div ref={playerTagRef}></div> : <span>Recorded Video Is Damaged Please Record Again</span>}</>
  );
});

export default memo(SessionPlayer);
