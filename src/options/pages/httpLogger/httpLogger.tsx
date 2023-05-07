import React, { useEffect, useState, useRef } from 'react';
import { ListenerType } from 'src/models/WebRequestModel';
import ColorCover from 'components/common/colorCover/colorCover';
import Input from 'components/common/input/input';
import CrossSVG  from 'assets/icons/cross.svg';
import DoubleSquareSVG  from 'assets/icons/doubleSquare.svg';
import SearchSVG  from 'assets/icons/search.svg';
import OutlineButton from 'components/common/outlineButton/outlineButton';

const HTTPLogger = ({ clientName, showOpenWindowBtn = true, listBoxClasses = '', infoBoxClasses = '' }) => {
  const portRef = useRef<any>();
  const [requestList, setRequestList] = useState<any>({});
  const [activeReuquestId, setActiveRequestId] = useState();
  const [search, setSearch] = useState<string>('');
  const onChangeSearch = event => setSearch(event.target.value);
  const onHandleClearSearch = () => setSearch('');

  const onMessage = message => {
    const newRequest: any = {};
    const { type: messageType, requestHeadersDetails } = message;
    const { requestId, requestHeaders, responseHeaders, method, url, type, ip, fromCache, statusCode } = requestHeadersDetails;
    newRequest.method = method;
    newRequest.url = url;
    newRequest.type = type;

    if(messageType === ListenerType.BEFORESENDHEADERS ) {
      newRequest.requestHeaders = requestHeaders;
    }

    if(messageType === ListenerType.HEADERSRECEIVED ) {
      newRequest.responseHeaders = responseHeaders;
    }

    if(messageType === ListenerType.COMPLETED ) {
      newRequest.ip = ip;
      newRequest.fromCache = fromCache;
      newRequest.statusCode = statusCode;
    }
    setRequestList(data => {
      return {
        ...data,
        [requestId]: {...(data[requestId] || {} ), ...newRequest }
      }
    });
  }

  const handleClearLogs = () => {
    setRequestList({});
    setActiveRequestId(undefined);
  }

  const handleOpenWindow = () => {
    portRef.current.postMessage('openWindow');
    setTimeout(window.close);
  }

  useEffect(() => {
    const port = chrome.runtime.connect({name: clientName});
    port.onMessage.addListener(onMessage);
    portRef.current = port;
    
    return () => {
      port.postMessage('disconnect');
    };
  }, []);

  return <div className="h-full">
    <ColorCover classes={`max-h-[300px] pb-0 pt-[10px] ${listBoxClasses}`}>
      <div className="text-sm flex justify-end gap-5 items-center pb-3 ">
        {showOpenWindowBtn && <OutlineButton onClick={handleOpenWindow} icon={<DoubleSquareSVG />}>Open In Window</OutlineButton>}
        <OutlineButton onClick={handleClearLogs} icon={<CrossSVG />}>Clear Logs</OutlineButton>
        <div className="w-[250px]">
          <Input
            placeholder="Search By URL"
            onChange={onChangeSearch}
            value={search}
            starts={<span className="w-[24px]"><SearchSVG /></span>}
            ends={<span onClick={onHandleClearSearch} className="w-[24px] hover:text-red-400 cursor-pointer"><CrossSVG /></span>}
          />
        </div>
      </div>
      <div className="py-3 text-sm border-b border-slate-700 w-full flex justify-between items-center h-[10%] bg-slate-700 bg-opacity-40">
          <div className="flex-[1]">ID</div>
          <div className="flex-[1]">Status Code</div>
          <div className="flex-[1]">Method</div>
          <div className="flex-[1]">Type</div>
          <div className="flex-[1]">IP</div>
          <div className="flex-[1]">From Cache</div>
          <div className="flex-[3]">URL</div>
      </div>
      <ul className="h-[75%] overflow-y-auto">
        {Object.entries(requestList)
        .filter(([_, request]: any) => request.url.includes(search) )
        .map(([requestId, request]: any) => (
          <li key={requestId}
              onClick={() => setActiveRequestId(requestId)}
              className={`text-sm max-h-[90%] overflow-y-auto border-b border-slate-700
                          w-full flex justify-between items-center py-3 hover:bg-slate-800 hover:bg-opacity-40
                          ${requestId === activeReuquestId ? 'text-sky-500' : ''}
                          `}>
            <div className="flex-[1]">{requestId || 'unknown'}</div>
            <div className="flex-[1]">{request.statusCode || 'unknown'}</div>
            <div className="flex-[1]">{request.method || 'unknown'}</div>
            <div className="flex-[1]">{request.type || 'unknown'}</div>
            <div className="flex-[1]">{request.ip || 'unknown'}</div>
            <div className="flex-[1]">{String(request.fromCache)}</div>
            <div className="flex-[3] text-ellipsis whitespace-nowrap w-[1px]">{request.url || 'unknown'}</div>
          </li>
        ))}
      </ul>
    </ColorCover>
    <ColorCover classes={`max-h-[400px] mt-[10px] ${infoBoxClasses}`}>
      {activeReuquestId && (
        <>
        {requestList[activeReuquestId]?.requestHeaders && (
          <>
            <div className="text-xl font-extrabold">Request Headers</div>
            <hr />
            <ul>
              {requestList[activeReuquestId]?.requestHeaders?.map(({name, value}, index) => {
                return <div key={index} className="text-sm overflow-y-auto border-b border-slate-700 w-full gap-2 flex whitespace-nowrap py-1 hover:bg-slate-800 hover:bg-opacity-40">
                    <span className="font-bold">{name}:</span>
                    <span className="font-light">{value}</span>
                  </div>
              })}
            </ul>
            
          </>
        )}
        {requestList[activeReuquestId]?.responseHeaders && (
          <>
            <div className="text-xl font-black">Response Headers</div>
            <hr />
            <ul>
              {requestList[activeReuquestId]?.responseHeaders?.map(({name, value}, index) => {
                return <div key={index} className="text-sm overflow-y-auto border-b border-slate-700 w-full gap-2 flex whitespace-nowrap py-1 hover:bg-slate-800 hover:bg-opacity-40">
                    <span className="font-bold">{name}:</span>
                    <span className="font-light">{value}</span>
                  </div>
              })}
            </ul>
            
          </>
        )}
        </>
      )}
      
    </ColorCover>
    </div>
};

export default HTTPLogger;