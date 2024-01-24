import Icon from "@options/components/common/icon/icon";
import Section from "@options/components/common/section/section";
import Tooltip from "@options/components/common/tooltip/tooltip";
import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import Dialog from "@/options/components/dialog/dialog";
import Button from "@/options/components/common/button/button";
import rrwebPlayer from "rrweb-player";
import { RecordSession } from "@models/recordSessionModel";
import { PostMessageAction } from "@/models/postMessageActionModel";
import { Link } from "react-router-dom";
import { FC, ReactElement, useEffect, useRef, useState } from "react";

type Props = {
  id: number;
  isSharing: boolean;
  dialogName: string;
  onDelete: () => void;
  onShare: (data: RecordSession) => void;
  setDialogName: (name: string) => void;
  selectSession: (session: RecordSession | null) => void;
};

const Session: FC<Props> = ({
  id,
  onDelete,
  onShare,
  isSharing,
  dialogName,
  selectSession,
  setDialogName,
}): ReactElement => {
  const [isHovered, setHovered] = useState(false);
  const [session, setSession] = useState<RecordSession>({} as RecordSession);
  const videoRef = useRef<rrwebPlayer>();

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.GetRecordedSessionById,
        data: { id },
      },
      (response) => {
        if (response.error) {
          return;
        }
        if (response.events?.length > 1) {
          setSession(response);
        }
      }
    );
  }, [id]);

  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play?.();
    } else {
      videoRef.current?.pause?.();
    }
  }),
    [isHovered];

  return (
    <>
      <Dialog
        title="Confirm Deletion"
        visible={dialogName === "previewDelete"}
        onClose={() => {
          selectSession(null);
          setDialogName("");
        }}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              trackName="Delete Session - NO"
              className="min-w-[100px]"
              onClick={() => {
                selectSession(null);
                setDialogName("");
              }}
            >
              No
            </Button>
            <Button
              variant="outline"
              startIcon={<Icon name="trash" />}
              className="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete Session - YES"
              onClick={() => {
                setDialogName("");
                onDelete();
              }}
            >
              Yes
            </Button>
          </div>
        }
      >
        <div className="my-10 text-2xl text-center text-slate-200 back">
          Are You Sure Want To Delete Recorded Sessions?
        </div>
      </Dialog>
      <Section classes="flex flex-col gap-3 rounded">
        <div className="flex items-center justify-between">
          <div className="text-ellipsis gap-4 max-w-[150px] whitespace-nowrap	overflow-hidden">
            <Tooltip content={session.url}>
              <span>{session.url}</span>
            </Tooltip>
          </div>
          <div className="flex gap-1">
            <Tooltip content="Play">
              <Link to={String(session?.id)}>
                <div className="cursor-pointer hover:text-sky-500">
                  <Icon name="play" />
                </div>
              </Link>
            </Tooltip>
            <Tooltip content="Share">
              <div
                className={`cursor-pointer hover:text-sky-500 ${
                  session?.docID ? "text-sky-500" : "hover:text-sky-500"
                }`}
                onClick={() => onShare(session)}
              >
                <Icon name={isSharing ? "loader" : "share"} />
              </div>
            </Tooltip>
            <Tooltip content="Delete Recoreded Session">
              <div
                className="cursor-pointer hover:text-red-400"
                onClick={() => {
                  selectSession(session);
                  setDialogName("previewDelete");
                }}
              >
                <Icon name="trash" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <Link to={String(session?.id)}>
            <div className="flex justify-center items-center w-[230px] h-[200px] my-0 mx-auto">
              {isHovered ? (
                <SessionPlayer
                  session={session}
                  playerOptions={{ width: 230, height: 200, showController: false }}
                  /* @ts-ignore */
                  ref={videoRef}
                />
              ) : (
                <div className="flex items-center justify-center gap-2 overflow-hidden">
                  {session.preview ? (
                    <img src={session?.preview} alt={session?.name} />
                  ) : (
                    <Icon name="photo" className="w-32" />
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
      </Section>
    </>
  );
};

export default Session;
