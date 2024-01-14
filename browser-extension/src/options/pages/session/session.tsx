import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import BackButton from "@options/components/common/backButton/backButton";
import Section from "@options/components/common/section/section";
import Input from "@/options/components/common/input/input";
import Toast from "@/options/components/common/toast/toast";
import Tooltip from "@/options/components/common/tooltip/tooltip";
import Button from "@/options/components/common/button/button";
import ClipboardSVG from "@assets/icons/clipboard.svg";
import TrashSVG from "@assets/icons/trash.svg";
import ShareSVG from "@assets/icons/share.svg";
import LoaderSVG from "@assets/icons/loader.svg";
import Copy from "copy-to-clipboard";
import { EventType, IncrementalSource } from "rrweb";
import { FC, ReactElement, memo, useContext, useEffect, useMemo, useState } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { useParams, useLocation, Link } from "react-router-dom";
import { RecordSession } from "@models/recordSessionModel";
import { SidebarContext } from "@/context/sidebarContext";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "@utils/timeDifference";
import { APP_URL } from "@/options/constant";
import { toast } from "react-toastify";
import Dialog from "@/options/components/dialog/dialog";

const Session: FC = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [session, setSession] = useState<RecordSession>();
  const [isSessionShared, setIsSessionShared] = useState<boolean>(!!session?.docID);
  const [docID, setDocID] = useState<string>(session?.docID || "");
  const isSharedUrl = location.pathname.includes("shared");
  const sessionMemo = useMemo(() => session, [session]);
  const playerOptions = useMemo(() => ({ width: 800, height: 500 }), []);
  const { setFull } = useContext(SidebarContext);
  const { id } = useParams();

  // FIXME:
  // investigate why updating session breaks player
  useEffect(() => {
    setIsSessionShared(!!session?.docID || isSessionShared);
    setDocID(session?.docID || docID);
  }, [session?.docID]);

  useEffect(() => {
    setLoading(true);
    chrome.runtime.sendMessage(
      {
        action: isSharedUrl ? PostMessageAction.GetSharedRecordedSession : PostMessageAction.GetRecordedSessionById,
        data: { id },
      },
      (response) => {
        setLoading(false);
        if (response.error) {
          setError(response.message);
          return;
        }
        if (response.events?.length > 1) {
          setSession(response);
        }
      }
    );
  }, []);

  const handleShare = () => {
    if (isSessionShared) return;
    setIsSharing(true);
    (session as RecordSession).ttl = Number(new Date());
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.ShareRecordedSession,
        data: { session },
      },
      (data) => {
        if (data.error) {
          toast(<Toast error text="Somthing Went Wrong" />);
          return;
        }
        const sharedSession = { ...session, docID: data.docID } as RecordSession;
        chrome.runtime.sendMessage(
          {
            action: PostMessageAction.UpdateRecordedSession,
            data: sharedSession,
          },
          () => {
            setIsSharing(false);
            setIsSessionShared(true);
            setDocID(data.docID);
            toast(<Toast text="Session Shared!" />);
          }
        );
      }
    );
  };

  const handleDelete = () => {
    if (isSharedUrl) return;
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRecordedSessionById,
        data: { session: { ...session, docID } },
      },
      () => navigate("/record/session")
    );
  };

  const generateShareUrl = (): string => {
    return `${APP_URL}/app/record/shared/session/${docID || id}`;
  };

  const handleCopyToClipboard = () => {
    Copy(generateShareUrl());
    toast(<Toast text="URL Copied!" />);
  };

  const getDuration = (session) => {
    try {
      const { minutes, seconds } = timeDifference(
        session.events[0].timestamp,
        session.events[session.events.length - 1].timestamp
      );
      return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
    } catch (error) {
      return "";
    }
  };

  const isEventConsole = (event) => {
    if (event.type === EventType.IncrementalSnapshot) {
      return event.data.source === IncrementalSource.Log;
    }
    if (event.type === EventType.Plugin) {
      return event.data.plugin === "rrweb/console@1";
    }
  };

  const consoleLogs = useMemo(() => {
    return session?.events
      ?.map((event) => {
        let logData: any = null;

        if (isEventConsole(event)) {
          if (event.type === EventType.IncrementalSnapshot) {
            logData = event.data;
          }
          if (event.type === EventType.Plugin) {
            logData = event.data.payload;
          }
          return logData;
        }
      })
      .filter((logData) => !!logData);
  }, [session?.events]);

  return (
    <Section classes="mx-[5%] p-5 flex flex-col gap-5 min-h-[300px]">
      <Dialog
        title="Confirm Deletion"
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <OutlineButton
              trackName="Delete Session - NO"
              classes="min-w-[100px]"
              onClick={() => setDialogVisible(false)}
            >
              No
            </OutlineButton>
            <OutlineButton
              prefix={<TrashSVG />}
              classes="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete Session - YES"
              onClick={() => {
                handleDelete();
                setDialogVisible(false);
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
      {loading && (
        <div className="flex items-center justify-center w-full h-full p-20">
          <div className="w-32 h-32 h">
            <LoaderSVG />
          </div>
        </div>
      )}
      {error && (
        <div>
          {error === "notFound" && (
            <div>
              <p className="text-lg">The Session You're Looking For Does Not Exist. </p>
              <p className="leading-7 text-slate-400">Please Ensure That You Have Entered The Correct URL.</p>
              <p className="leading-7 text-slate-400">Or Contact The Session Owner For Assistance.</p>
              <Link to="/">
                <Button classes="py-0 px-1" trackName="404">
                  Go Main Page
                </Button>
              </Link>
              <div className="flex justify-center w-full">
                <span className="px-2 tracking-widest text-white rounded bg-sky-600 text-9xl">404</span>
              </div>
            </div>
          )}
          {error !== "notFound" && <div>{error}</div>}
        </div>
      )}
      {session && (
        <>
          <div className="flex justify-between">
            <BackButton trackName="session" url="/record/session" text="Sessions" />
            <div className="text-xl capitalize">{session?.name}</div>
            <div className="flex gap-2">
              <OutlineButton
                trackName="Delete Recorded Session in view mode"
                classes="hover:border-red-400 hover:text-red-400"
                onClick={() => setDialogVisible(true)}
                prefix={<TrashSVG />}
                disabled={isSharedUrl}
              >
                Delete
              </OutlineButton>
              <OutlineButton
                disabled={isSessionShared || isSharedUrl}
                trackName="Share Recorded Session in view mode"
                onClick={handleShare}
                prefix={<ShareSVG />}
                suffix={isSharing ? <LoaderSVG /> : null}
              >
                Share{isSessionShared ? "d" : null}
              </OutlineButton>
              {(isSessionShared || isSharedUrl) && (
                <Input
                  readOnly
                  value={generateShareUrl()}
                  suffix={
                    <Tooltip content="Copy">
                      <div className="cursor-pointer hover:text-sky-500">
                        <span
                          onClick={handleCopyToClipboard}
                          className="w-[24px] inline-block cursor-pointer hover:text-sky-500"
                        >
                          <ClipboardSVG />
                        </span>
                      </div>
                    </Tooltip>
                  }
                />
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <Section classes="rounded flex gap-2 max-w-[300px] whitespace-nowrap	">
              <span className="text-slate-400">URL: </span>
              <span>{session.url}</span>
            </Section>
            <Section classes="rounded flex gap-2">
              <span className="text-slate-400">Recorded at: </span>
              <span>{session.date}</span>
            </Section>
            <Section classes="rounded flex gap-2">
              <span className="text-slate-400">Duraction: </span>
              <span>{getDuration(session)}</span>
            </Section>
          </div>
        </>
      )}
      <div className="m-auto">
        <SessionPlayer session={sessionMemo} playerOptions={playerOptions} />
      </div>
    </Section>
  );
};

export default memo(Session);
