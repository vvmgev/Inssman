import AutoSizer from "react-virtualized-auto-sizer";
import Section from "@options/components/common/section/section";
import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import Input from "@options/components/common/input/input";
import Popup from "reactjs-popup";
import SessionPreview from "./components/sessionPreview/sessionPreview";
import Toast from "@/options/components/common/toast/toast";
import Copy from "copy-to-clipboard";
import TrashSVG from "@assets/icons/trash.svg";
import SearchSVG from "@assets/icons/search.svg";
import CrossSVG from "@assets/icons/cross.svg";
import VideoCameraSVG from "@assets/icons/videoCamera.svg";
import List from "@options/components/common/list/list";
import { FC, ReactElement, useEffect, useState } from "react";
import { LIST_HEADERS, LIST_ITEMS } from "./list.config";
import { PostMessageAction } from "@models/postMessageActionModel";
import { RecordSession } from "@models/recordSessionModel";
import { FixedSizeList } from "react-window";
import { toast } from "react-toastify";
import { APP_URL } from "@/options/constant";

enum SessionListType {
  GRID = "grid",
  LIST = "list",
}
const sessionListType = (window.localStorage.getItem("sessionListType") as SessionListType) || SessionListType.LIST;

const SessionList: FC = (): ReactElement => {
  const [listType, setListType] = useState<SessionListType>(sessionListType);
  const [search, setSearch] = useState<string>("");
  const [sessions, setSessions] = useState<RecordSession[]>([]);
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

  const handleDelete = (session) => {
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRecordedSessionById,
        data: { id: session.id },
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
    if (session?.docID) return;
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
            getSessions();
            toast(<Toast text="Session Shared!" />);
          }
        );
      }
    );
  };

  const filteredSessions = sessions.filter((session) => session.name.includes(search)).reverse();
  const title = sessions.length ? `No Session found for "${search}"` : "Seems You Have Not Recorded a Session Yet";

  return (
    <Section classes="mx-[5%] p-0 pb-5 min-h-[650px]">
      <div className="flex justify-between p-5">
        <span className="flex flex-row items-center gap-2">
          <span className="w-[24px] inline-block">{<VideoCameraSVG />}</span>
          <span>Recorded Sessions</span>
        </span>
        <div className="flex gap-3">
          <Popup
            closeOnDocumentClick={true}
            contentStyle={{ background: "transparent", border: "none" }}
            trigger={
              <OutlineButton
                classes="text-sm hover:text-red-400 hover:border-red-400"
                trackName="Delete All Session"
                icon={<TrashSVG />}
              >
                Delete All Sessions
              </OutlineButton>
            }
            modal
            position="right center"
            overlayStyle={{ backdropFilter: "blur(1.5px)" }}
          >
            {/* @ts-ignore */}
            {(close: any) => (
              <Section classes="bg-opacity-90 py-15">
                <div className="flex pb-5 border-b border-slate-700">
                  <div className="flex-1 text-2xl text-slate-200">Confirm Deletion</div>
                  <div className="flex justify-end flex-1">
                    <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500">
                      <CrossSVG />
                    </span>
                  </div>
                </div>
                <div className="my-10 text-2xl text-center text-slate-200">
                  Are You Sure Want To Delete All Recorded Sessions?
                </div>
                <div className="flex flex-row items-center justify-center gap-10 text-2xl text-slate-200">
                  <OutlineButton trackName="Delete All Rules - NO" classes="min-w-[100px]" onClick={close}>
                    No
                  </OutlineButton>
                  <OutlineButton
                    icon={<TrashSVG />}
                    classes="min-w-[100px] hover:text-red-400 hover:border-red-400"
                    trackName="Delete All Rules - YES"
                    onClick={() => handleDeleteSessions(close)}
                  >
                    Yes
                  </OutlineButton>
                </div>
              </Section>
            )}
          </Popup>
          <div className="mr-4 text-sm">
            <Input
              placeholder="Search By Session Name"
              onChange={onChangeSearch}
              value={search}
              prefix={
                <span className="w-[24px]">
                  <SearchSVG />
                </span>
              }
              suffix={
                <span onClick={onHandleClearSearch} className="w-[24px] hover:text-red-400 cursor-pointer">
                  <CrossSVG />
                </span>
              }
            />
          </div>
          {/* <button onClick={() => handleListType(SessionListType.GRID)} className={`flex items-center rounded px-4 py-2 ${listType === SessionListType.GRID ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><SquaresSVG /></span>
        </button>
        <button onClick={() => handleListType(SessionListType.LIST)} className={`flex items-center rounded px-4 py-2 ${listType === SessionListType.LIST ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><ListSVG /></span>
        </button> */}
        </div>
      </div>
      {listType === SessionListType.GRID ? (
        <div className="flex flex-row flex-wrap justify-between w-full h-full gap-2 mx-5 mt-4">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                className="List"
                height={height}
                itemCount={sessions.length >= 3 ? Math.ceil(sessions.length / 3) : 1}
                itemSize={280}
                width={width}
                itemData={filteredSessions}
              >
                {({ index, data, style }) => (
                  <div className="w-[200px]" style={style}>
                    <div className="flex gap-3">
                      {data[index * 3] && <SessionPreview data={data[index * 3]} onDelete={alert} />}
                      {data[index * 3 + 1] && <SessionPreview data={data[index * 3 + 1]} onDelete={alert} />}
                      {data[index * 3 + 2] && <SessionPreview data={data[index * 3 + 2]} onDelete={alert} />}
                    </div>
                  </div>
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap mt-4 text-center">
          <List
            headers={LIST_HEADERS}
            items={LIST_ITEMS}
            handlers={{
              handleCopyToClipboard,
              handleShare,
              handleDelete,
              generateShareUrl,
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

export default SessionList;
