import Section from "@options/components/common/section/section";
import Button from "@options/components/common/button/button";
import Input from "@options/components/common/input/input";
import Dialog from "@/options/components/dialog/dialog";
import IndexDBService from "@/services/IndexDBService";
import SessionPreview from "./components/sessionPreview/sessionPreview";
import Toast from "@/options/components/common/toast/toast";
import Copy from "copy-to-clipboard";
import Icon from "@options/components/common/icon/icon";
import List from "@options/components/common/list/list";
import { FC, ReactElement, memo, useEffect, useState } from "react";
import { LIST_HEADERS, LIST_ITEMS } from "./list.config";
import { PostMessageAction } from "@models/postMessageActionModel";
import { RecordSession } from "@models/recordSessionModel";
import { toast } from "react-toastify";
import { APP_URL } from "@/options/constant";

enum SessionListType {
  GRID = "grid",
  LIST = "list",
}
const sessionListType = (window.localStorage.getItem("sessionListType") as SessionListType) || SessionListType.LIST;

const SessionList: FC = (): ReactElement => {
  const [listType, setListType] = useState<SessionListType>(sessionListType);
  const [sharingItemId, setSharingItemId] = useState<number | null>();
  const [search, setSearch] = useState<string>("");
  const [dialogName, setDialogName] = useState<string>("");
  const [sessions, setSessions] = useState<RecordSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<RecordSession | null>();
  const onHandleClearSearch = () => setSearch("");
  const onChangeSearch = (event) => setSearch(event.target.value);
  const getSessions = (): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.GetRecordedSessions }, (data) => {
      if (data.error) {
        return;
      }
      setSessions(data);
    });

  useEffect(() => {
    getSessions();
  }, []);

  const handleDelete = () => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRecordedSession,
        data: { session: selectedSession },
      },
      getSessions
    );
  };

  const handleDeleteSessions = (close) => {
    chrome.runtime.sendMessage({ action: PostMessageAction.DeleteRecordedSessions }, () => {
      close();
      getSessions();
    });
  };

  const handleListType = (listType: SessionListType): void => {
    window.localStorage.setItem("sessionListType", listType);
    setListType(listType);
  };

  const handleCopyToClipboard = (docID) => {
    Copy(`${APP_URL}/app/record/shared/session/${docID}`);
    toast(<Toast text="URL Copied!" />);
  };

  const generateShareUrl = (docID): string => {
    return `${APP_URL}/app/record/shared/session/${docID}`;
  };

  const handleShare = (session) => {
    if (session?.docID || sharingItemId) return;
    setSharingItemId(session.id);
    session.ttl = Number(new Date());
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.ShareRecordedSession,
        data: { session: { ...session } },
      },
      (data) => {
        if (data.error) {
          setSharingItemId(null);
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
            setSharingItemId(null);
            getSessions();
            toast(<Toast text="Session Shared!" />);
          }
        );
      }
    );
  };

  const filteredSessions = sessions.filter((session) => session.name.includes(search)).reverse();
  const title = sessions.length ? `No Session found for "${search}"` : "Seems You Have Not Recorded a Session";

  useEffect(() => {
    const syncSessions = async () => {
      const sharedSessions = sessions.filter(({ docID }) => !!docID);
      if (sharedSessions.length) {
        chrome.runtime.sendMessage(
          {
            action: PostMessageAction.GetSharedRecordedSessionByDocIDs,
            data: { ids: sharedSessions.map(({ docID }) => docID) },
          },
          async (data = []) => {
            let updateSessionList = false;
            for (const sharedSession of sharedSessions) {
              const session = data.find(({ id }) => id === sharedSession.id);
              if (!session) {
                updateSessionList = true;
                delete sharedSession.docID;
                await IndexDBService.put(sharedSession);
              }
            }
            if (updateSessionList) {
              getSessions();
            }
          }
        );
      }
    };

    syncSessions();
  }, [sessions]);

  return (
    <Section classes="p-0 min-h-[500px] bg-slate-800 bg-opacity-40 border-l-0 border-t-0 h-full">
      <Dialog
        title="Confirm Deletion"
        visible={dialogName === "deleteAll"}
        onClose={() => setDialogName("")}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              trackName="Delete All Sessions - NO"
              className="min-w-[100px]"
              onClick={() => setDialogName("")}
            >
              No
            </Button>
            <Button
              variant="outline"
              startIcon={<Icon name="trash" />}
              className="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete All Sessions - YES"
              onClick={() => handleDeleteSessions(setDialogName)}
            >
              Yes
            </Button>
          </div>
        }
      >
        <div className="my-10 text-2xl text-center text-slate-200 back">
          Are You Sure Want To Delete All Recorded Sessions?
        </div>
      </Dialog>
      <Section classes="flex justify-between p-5 border-0 border-b border-r">
        <span className="flex flex-row items-center gap-2 text-lg">
          <Icon name="videoCamera" />
          <span>Recorded Sessions</span>
        </span>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="hover:text-red-400 hover:border-red-400"
            trackName="Delete All Session"
            startIcon={<Icon name="trash" />}
            onClick={() => setDialogName("deleteAll")}
          >
            Delete All Sessions
          </Button>
          <div className="mr-4 text-sm">
            <Input
              placeholder="Search By Session Name"
              onChange={onChangeSearch}
              value={search}
              startIcon={<Icon name="search" />}
              endIcon={<Icon name="cross" onClick={onHandleClearSearch} className="hover:text-red-400" />}
            />
          </div>
          <Button
            variant="icon"
            trackName="grid"
            onClick={() => handleListType(SessionListType.GRID)}
            className={`flex items-center rounded px-4 py-2 border border-slate-500 ${
              listType === SessionListType.GRID ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            <Icon name="squares" />
          </Button>
          <Button
            variant="icon"
            trackName="list"
            onClick={() => handleListType(SessionListType.LIST)}
            className={`flex items-center rounded px-4 py-2 border border-slate-500 ${
              listType === SessionListType.LIST ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            <Icon name="list" />
          </Button>
        </div>
      </Section>
      {listType === SessionListType.GRID ? (
        <div className="flex flex-wrap gap-2 px-3 mt-4">
          {filteredSessions.length ? (
            <div className="w-full grid gap-4 grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
              {filteredSessions.map((session) => (
                <SessionPreview
                  key={session.id}
                  selectSession={setSelectedSession}
                  setDialogName={setDialogName}
                  data={session}
                  dialogName={dialogName}
                  isSharing={sharingItemId === session.id}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-full text-2xl min-h-[400px]">
              <span>{title}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row flex-wrap text-center">
          <List
            headers={LIST_HEADERS}
            items={LIST_ITEMS}
            options={{
              handleCopyToClipboard,
              handleShare,
              handleDelete,
              generateShareUrl,
              selectSession: setSelectedSession,
              setDialogName,
              dialogName,
              sharingItemId,
            }}
            data={filteredSessions}
            texts={{
              title,
              description: "",
            }}
          />
        </div>
      )}
    </Section>
  );
};

export default memo(SessionList);
