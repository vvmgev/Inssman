import rrwebPlayer from "rrweb-player";
import TrashSVG from "@assets/icons/trash.svg";
import ShareSVG from "@assets/icons/share.svg";
import PlaySVG from "@assets/icons/play.svg";
import LoaderSVG from "@assets/icons/loader.svg";
import Section from "@options/components/common/section/section";
import Tooltip from "@options/components/common/tooltip/tooltip";
import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { RecordSession } from "@models/recordSessionModel";
import { Link } from "react-router-dom";
import Dialog from "@/options/components/dialog/dialog";
import OutlineButton from "@/options/components/common/outlineButton/outlineButton";

type Props = {
  data: RecordSession;
  isSharing: boolean;
  dialogName: string;
  onDelete: () => void;
  onShare: (data: RecordSession) => void;
  setDialogName: (name: string) => void;
  setActiveItem: (session: RecordSession | null) => void;
};

const Session: FC<Props> = ({
  data,
  onDelete,
  onShare,
  isSharing,
  dialogName,
  setActiveItem,
  setDialogName,
}): ReactElement => {
  const [isHovered, setHovered] = useState(false);
  const [session, setSession] = useState<RecordSession>();
  const videoRef = useRef<rrwebPlayer>();

  useEffect(() => {
    if (data.events.length > 1) {
      setSession(data);
    }
  }, [data]);

  return (
    <div>
      <Dialog
        title="Confirm Deletion"
        visible={dialogName === "previewDelete"}
        onClose={() => {
          setActiveItem(null);
          setDialogName("");
        }}
        footer={
          <div className="flex justify-end gap-3">
            <OutlineButton
              trackName="Delete Session - NO"
              classes="min-w-[100px]"
              onClick={() => {
                setActiveItem(null);
                setDialogName("");
              }}
            >
              No
            </OutlineButton>
            <OutlineButton
              prefix={<TrashSVG />}
              classes="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete Session - YES"
              onClick={() => {
                setDialogName("");
                onDelete();
              }}
            >
              Yes
            </OutlineButton>
          </div>
        }
      >
        <div className="my-10 text-2xl text-center text-slate-200 back">
          Are You Sure Want To Delete Recorded Sessions?
        </div>
      </Dialog>
      <Section classes="flex flex-col gap-3 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-ellipsis gap-4 max-w-[150px] whitespace-nowrap	overflow-hidden">
            <Tooltip content={data.url}>
              <span>{data.url}</span>
            </Tooltip>
          </div>
          <div className="flex gap-1">
            <Tooltip content="Play">
              <Link to={String(session?.id)}>
                <div className="cursor-pointer hover:text-sky-500">
                  <span className="w-[24px] inline-block">
                    <PlaySVG />
                  </span>
                </div>
              </Link>
            </Tooltip>
            <Tooltip content="Share">
              <div
                className={`cursor-pointer hover:text-sky-500 ${data?.docID ? "text-sky-500" : "hover:text-sky-500"}`}
                onClick={() => onShare(data)}
              >
                <span className="w-[24px] inline-block">{isSharing ? <LoaderSVG /> : <ShareSVG />}</span>
              </div>
            </Tooltip>
            <Tooltip content="Delete Recoreded Session">
              <div
                className="cursor-pointer hover:text-red-400"
                onClick={() => {
                  setActiveItem(data);
                  setDialogName("previewDelete");
                }}
              >
                <span className="w-[24px] inline-block">
                  <TrashSVG />
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="relative group">
          <Link to={String(session?.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="flex justify-center items-center">
              {isHovered ? (
                <SessionPlayer
                  session={session}
                  playerOptions={{ width: 230, height: 200, showController: false }}
                  /* @ts-ignore */
                  ref={videoRef}
                />
              ) : (
                <div className="flex gap-2 w-[230px] h-[200px] items-center justify-center overflow-hidden">
                  <img
                    src={session?.preview}
                    onLoad={(event: any) => event.target.classList?.toggle("invisible")}
                    alt=""
                    className="invisible"
                  />
                </div>
              )}
            </div>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Session;
