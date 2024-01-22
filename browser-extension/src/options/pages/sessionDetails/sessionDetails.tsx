import SessionPlayer from "@options/components/common/sessionPlayer/sessionPlayer";
import Dialog from "@/options/components/dialog/dialog";
import BackButton from "@options/components/common/backButton/backButton";
import Section from "@options/components/common/section/section";
import Input from "@/options/components/common/input/input";
import Toast from "@/options/components/common/toast/toast";
import Tooltip from "@/options/components/common/tooltip/tooltip";
import Button from "@/options/components/common/button/button";
import Icon from "@options/components/common/icon/icon";
import Copy from "copy-to-clipboard";
import { EventType, IncrementalSource } from "rrweb";
import { FC, ReactElement, memo, useContext, useEffect, useMemo, useState } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { useParams, useLocation, Link } from "react-router-dom";
import { RecordSession } from "@models/recordSessionModel";
import { SidebarContext } from "@context/sidebarContext";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "@utils/timeDifference";
import { APP_URL } from "@/options/constant";
import { toast } from "react-toastify";

const sessionDetails: FC = (): ReactElement => {
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
        action: PostMessageAction.DeleteRecordedSession,
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
    <Section classes="flex flex-col gap-5 min-h-[300px] p-0 bg-slate-800 bg-opacity-40 border-t-0">
      <Dialog
        title="Confirm Deletion"
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              trackName="Delete Session - NO"
              className="min-w-[100px]"
              onClick={() => setDialogVisible(false)}
            >
              No
            </Button>
            <Button
              variant="outline"
              startIcon={<Icon name="trash" />}
              className="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete Session - YES"
              onClick={() => {
                handleDelete();
                setDialogVisible(false);
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
      {loading && (
        <div className="flex items-center justify-center w-full h-full p-20">
          <div className="w-32 h-32 h">
            <Icon name="loader" />
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
                <Button trackName="404">Go Main Page</Button>
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
          <Section classes="flex justify-between border-l-0 border-t-0 px-2 py-4">
            <BackButton trackName="session" url="/record/session" text="Sessions" />
            <div className="text-xl capitalize">{session?.name}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                trackName="Delete Recorded Session in view mode"
                className="hover:border-red-400 hover:text-red-400"
                onClick={() => setDialogVisible(true)}
                startIcon={<Icon name="trash" />}
                disabled={isSharedUrl}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                disabled={isSessionShared || isSharedUrl}
                trackName="Share Recorded Session in view mode"
                onClick={handleShare}
                startIcon={<Icon name="share" />}
                endIcon={isSharing ? <Icon name="loader" /> : null}
              >
                Share{isSessionShared ? "d" : null}
              </Button>
              {(isSessionShared || isSharedUrl) && (
                <Input
                  readOnly
                  value={generateShareUrl()}
                  endIcon={
                    <Tooltip content="Copy">
                      <div onClick={handleCopyToClipboard}>
                        <Icon name="clipboard" />
                      </div>
                    </Tooltip>
                  }
                />
              )}
            </div>
          </Section>
          <div className="flex gap-5 pl-2">
            <Section classes="flex gap-2 max-w-[300px] whitespace-nowrap	">
              <span className="text-slate-400">URL: </span>
              <span>{session.url}</span>
            </Section>
            <Section classes="flex gap-2">
              <span className="text-slate-400">Recorded at: </span>
              <span>{session.date}</span>
            </Section>
            <Section classes="flex gap-2">
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

export default memo(sessionDetails);
