import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import SessionPreview from "./components/sessionPreview/sessionPreview";
import ListSVG  from 'assets/icons/list.svg';
import PlaySVG  from 'assets/icons/play.svg';
import SquaresSVG  from 'assets/icons/squares.svg';
import ShareSVG  from 'assets/icons/share.svg';
import SearchSVG  from 'assets/icons/search.svg';
import CrossSVG  from 'assets/icons/cross.svg';
import VideoCameraSVG  from 'assets/icons/videoCamera.svg';
import Tooltip from "common/tooltip/tooltip";
import TrashSVG  from 'assets/icons/trash.svg';
import List, { ListHeader, ListItems } from "common/list/list";
import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PostMessageAction } from "src/models/postMessageActionModel";
import { RecordSession } from "src/models/recordSessionModel";
import { Link } from "react-router-dom";

enum SessionListType {
  GRID = 'grid',
  LIST = 'list',
}

const sessionListType = window.localStorage.getItem('sessionListType') as SessionListType || SessionListType.GRID;

const SessionList: FC = (): ReactElement => {
  const [listType, setListType] = useState<SessionListType>(sessionListType);
  const [search, setSearch] = useState<string>('');
  const [sessions, setSessions] = useState<RecordSession[]>([]);
  const onHandleClearSearch = () => setSearch('');
  const onChangeSearch = event => setSearch(event.target.value);
  const getSessions = (): void => chrome.runtime.sendMessage({action: PostMessageAction.GetRecordedSessions}, setSessions);

  useEffect(() => {
    getSessions();
  }, []);

  const handleDelete = (session) => {
    chrome.runtime.sendMessage({
        action: PostMessageAction.DeleteRecordedSessionById,
        data: {id: session.id}
      },
      getSessions
    );
  }

  const handleListType = (listType: SessionListType): void => {
    window.localStorage.setItem('sessionListType', listType);
    setListType(listType);
  };

  const LIST_HEADERS: ListHeader[] = useMemo(() => {
    return [
      {title: 'Name', render: function() {return this.title}},
      {title: 'URL', render: function() {return this.title}},
      {title: 'Date', render: function() {return this.title}},
      {title: 'Actions', classes: 'flex justify-end', render: function() {return this.title}},
    ];
  }, []);

  const LIST_ITEMS: ListItems[] = useMemo(() => {
    return [
      {field: 'name', render: function(item) {return <span className="capitalize">{item[this.field]}</span>}},
      {field: 'url', render: function(item) {return item[this.field]}},
      {field: 'date', render: function(item) {return item[this.field]}},
      {field: 'actions', classes: 'flex justify-end', render: function(item) {return <div className="flex gap-5">
        <Tooltip
          content='Play'>
            <Link to={String(item.id)}>
              <div className="cursor-pointer hover:text-sky-500"><span className="w-[24px] inline-block"><PlaySVG /></span></div>
            </Link>
        </Tooltip>
        <Tooltip
          content='Share (cooming soon)'>
          <div className="cursor-pointer hover:text-sky-500"><span className="w-[24px] inline-block"><ShareSVG /></span></div>
        </Tooltip>
        <Tooltip
          content='Delete Session'>
          <div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(item)}><span className="w-[24px] inline-block"><TrashSVG /></span></div>
        </Tooltip>
        </div>
      }},
    ];
  }, [])

  const filteredSessions = sessions.filter((session) => session.name.includes(search)).reverse();

  return <ColorCover classes="mx-[5%] p-0 pb-5 min-h-[350px]">
    <div className="flex text-2xl justify-between p-5">
      <span className="flex flex-row items-center gap-2">
        <span className="w-[24px] inline-block">{<VideoCameraSVG />}</span>
        <span>Recorded Sessions</span>
      </span>
      <div className="flex gap-1">
        <div className="text-sm mr-4">
          <Input
            placeholder="Search By Session Name"
            onChange={onChangeSearch}
            value={search}
            starts={<span className="w-[24px]"><SearchSVG /></span>}
            ends={
              <span onClick={onHandleClearSearch}
                className="w-[24px] hover:text-red-400 cursor-pointer"><CrossSVG />
              </span>
            }
          />
        </div>
        <button onClick={() => handleListType(SessionListType.GRID)} className={`flex items-center rounded px-4 py-2 ${listType === SessionListType.GRID ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><SquaresSVG /></span>
        </button>
        <button onClick={() => handleListType(SessionListType.LIST)} className={`flex items-center rounded px-4 py-2 ${listType === SessionListType.LIST ? 'bg-blue-600' : 'hover:bg-blue-500'}`}>
          <span className="w-[24px]"><ListSVG /></span>
        </button>
      </div>
    </div>
    {sessions.length ? <div className={`flex flex-row flex-wrap mt-4 ${listType === SessionListType.GRID ? 'mx-5 gap-2 justify-between': ''}`}>
      {listType === SessionListType.GRID ? filteredSessions.map(session => (
          <div className="flex flex-row" key={session.id}>
            {listType === SessionListType.GRID ? <SessionPreview data={session} onDelete={handleDelete}/> : null }
          </div>
        )) : <List headers={LIST_HEADERS} items={LIST_ITEMS} data={filteredSessions} />
      }
    </div> :
    <div className="min-h-[350px] max-h-[450px] flex items-center justify-center">
      <div className="w-full text-center">
        <p className="text-2xl">Seems You Have Not Recorded a Session</p>
        <p className="mt-3">Please Select 'Record' Section In The Sidebar To Record</p>
      </div>
    </div>
    }

  </ColorCover>
};

export default SessionList;
