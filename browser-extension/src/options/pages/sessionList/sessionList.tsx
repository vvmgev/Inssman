import AutoSizer from "react-virtualized-auto-sizer";
import ColorCover from "@options/components/common/colorCover/colorCover";
import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import Input from "@options/components/common/input/input";
import Popup from "reactjs-popup";
import SessionPreview from "./components/sessionPreview/sessionPreview";
import PlaySVG from "@assets/icons/play.svg";
import ShareSVG from "@assets/icons/share.svg";
import SearchSVG from "@assets/icons/search.svg";
import CrossSVG from "@assets/icons/cross.svg";
import VideoCameraSVG from "@assets/icons/videoCamera.svg";
import Tooltip from "@options/components/common/tooltip/tooltip";
import TrashSVG from "@assets/icons/trash.svg";
import List, { ListHeader, ListItems } from "@options/components/common/list/list";
import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { RecordSession } from "@models/recordSessionModel";
import { Link } from "react-router-dom";
import { FixedSizeList } from "react-window";
import { timeDifference } from "@utils/timeDifference";
import { cutString } from "@utils/cutString";

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

  const LIST_HEADERS: ListHeader[] = useMemo(() => {
    return [
      {
        title: "Name",
        render: function () {
          return this.title;
        },
      },
      {
        title: "URL",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Date",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Duration",
        classes: "flex justify-end",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Actions",
        classes: "flex justify-end",
        render: function () {
          return this.title;
        },
      },
    ];
  }, []);

  const LIST_ITEMS: ListItems[] = useMemo(() => {
    return [
      {
        field: "name",
        render: function (item) {
          return (
            <div className="flex gap-2">
              <img
                src={`http://${new URL(item.url).hostname}/favicon.ico`}
                onLoad={(event: any) => event.target.classList?.toggle("invisible")}
                alt=""
                className="invisible w-5 h-5"
              />
              <span className="capitalize">{item[this.field]}</span>
            </div>
          );
        },
      },
      {
        field: "url",
        render: function (item) {
          return cutString(item[this.field]);
        },
      },
      {
        field: "date",
        render: function (item) {
          return item[this.field];
        },
      },
      {
        field: "duration",
        classes: "flex justify-end",
        render: function (item) {
          try {
            const { minutes, seconds } = timeDifference(
              item.events[0].timestamp,
              item.events[item.events.length - 1].timestamp
            );
            return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
          } catch (error) {
            return "";
          }
        },
      },
      {
        field: "actions",
        classes: "flex justify-end",
        render: function (item) {
          return (
            <div className="flex gap-5">
              <Tooltip content="Play">
                <Link to={String(item.id)}>
                  <div className="cursor-pointer hover:text-sky-500">
                    <span className="w-[24px] inline-block">
                      <PlaySVG />
                    </span>
                  </div>
                </Link>
              </Tooltip>
              <Tooltip content="Share (cooming soon)">
                <div className="cursor-pointer hover:text-sky-500">
                  <span className="w-[24px] inline-block">
                    <ShareSVG />
                  </span>
                </div>
              </Tooltip>
              <Tooltip content="Delete Session">
                <div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(item)}>
                  <span className="w-[24px] inline-block">
                    <TrashSVG />
                  </span>
                </div>
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }, []);

  const filteredSessions = sessions.filter((session) => session.name.includes(search)).reverse();
  const title = sessions.length ? `No Session found for "${search}"` : "Seems You Have Not Recorded a Session Yet";

  return (
    <ColorCover classes="mx-[5%] p-0 pb-5 min-h-[650px]">
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
              <ColorCover classes="bg-opacity-90 py-15">
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
              </ColorCover>
            )}
          </Popup>
          <div className="mr-4 text-sm">
            <Input
              placeholder="Search By Session Name"
              onChange={onChangeSearch}
              value={search}
              starts={
                <span className="w-[24px]">
                  <SearchSVG />
                </span>
              }
              ends={
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
            data={filteredSessions}
            texts={{
              title,
              description: "",
            }}
          />
        </div>
      )}
    </ColorCover>
  );
};

export default SessionList;
