import { useEffect, useState, useRef } from "react";
import { WebRequestListenerType, WebRequestClients } from "models/WebRequestModel";
import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import CrossSVG from "assets/icons/cross.svg";
import DoubleSquareSVG from "assets/icons/doubleSquare.svg";
import SearchSVG from "assets/icons/search.svg";
import OutlineButton from "common/outlineButton/outlineButton";
import BackButton from "common/backButton/backButton";

const HTTPLogger = ({ clientName, showOpenWindowBtn = true }) => {
  const portRef = useRef<any>();
  const [requestList, setRequestList] = useState<any>({});
  const [activeReuquestId, setActiveRequestId] = useState();
  const [search, setSearch] = useState<string>("");
  const onChangeSearch = (event) => setSearch(event.target.value);
  const onHandleClearSearch = () => setSearch("");

  const onMessage = (message) => {
    const newRequest: any = {};
    const { type: messageType, requestHeadersDetails } = message;
    const { requestId, requestHeaders, responseHeaders, method, url, type, ip, fromCache, statusCode } =
      requestHeadersDetails;
    newRequest.method = method;
    newRequest.url = url;
    newRequest.type = type;

    if (messageType === WebRequestListenerType.BEFORESENDHEADERS) {
      newRequest.requestHeaders = requestHeaders;
    }

    if (messageType === WebRequestListenerType.HEADERSRECEIVED) {
      newRequest.responseHeaders = responseHeaders;
    }

    if (messageType === WebRequestListenerType.COMPLETED) {
      newRequest.ip = ip;
      newRequest.fromCache = fromCache;
      newRequest.statusCode = statusCode;
    }
    setRequestList((data) => {
      return {
        ...data,
        [requestId]: { ...(data[requestId] || {}), ...newRequest },
      };
    });
  };

  const handleClearLogs = () => {
    setRequestList({});
    setActiveRequestId(undefined);
  };

  const handleOpenWindow = () => {
    portRef.current.postMessage("openWindow");
    setTimeout(window.close);
  };

  useEffect(() => {
    const port = chrome.runtime.connect({ name: clientName });
    port.onMessage.addListener(onMessage);
    portRef.current = port;

    return () => {
      port.postMessage("disconnect");
    };
  }, []);

  return (
    <div className={`${clientName === WebRequestClients.WINDOW ? "h-[95%]" : "h-[80%]"} mx-[5%] flex flex-col gap-2`}>
      <ColorCover classes={`h-[50%] p-5`}>
        <div className="flex justify-between mb-3 text-sm">
          {showOpenWindowBtn && <BackButton trackName="HTTPLogger" />}
          <div className="flex items-center justify-end gap-5 ">
            {showOpenWindowBtn && (
              <OutlineButton trackName="Open In Window" onClick={handleOpenWindow} icon={<DoubleSquareSVG />}>
                Open In Window
              </OutlineButton>
            )}
            <OutlineButton trackName="Clear Logs" onClick={handleClearLogs} icon={<CrossSVG />}>
              Clear Logs
            </OutlineButton>
            <div className="w-[250px]">
              <Input
                placeholder="Search By URL"
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
        <ul>
          {Object.entries(requestList)
            .filter(([_, request]: any) => request.url.includes(search))
            .map(([requestId, request]: any) => (
              <li
                key={requestId}
                onClick={() => setActiveRequestId(requestId)}
                className={`text-sm border-slate-700 border-b py-3
                          w-full flex justify-between items-center hover:bg-slate-800 hover:bg-opacity-40
                          ${requestId === activeReuquestId ? "text-sky-500" : ""}
                          `}
              >
                <div className="flex-[1]">{requestId || "unknown"}</div>
                <div className="flex-[1]">{request.statusCode || "unknown"}</div>
                <div className="flex-[1]">{request.method || "unknown"}</div>
                <div className="flex-[1]">{request.type || "unknown"}</div>
                <div className="flex-[1]">{request.ip || "unknown"}</div>
                <div className="flex-[1]">{String(request.fromCache)}</div>
                <div className="flex-[3] text-ellipsis whitespace-nowrap w-[1px]">{request.url || "unknown"}</div>
              </li>
            ))}
        </ul>
      </ColorCover>
      <ColorCover classes={`h-[50%]`}>
        {activeReuquestId && (
          <>
            {requestList[activeReuquestId]?.requestHeaders && (
              <>
                <div className="text-xl font-extrabold">Request Headers</div>
                <hr />
                <ul>
                  {requestList[activeReuquestId]?.requestHeaders?.map(({ name, value }, index) => {
                    return (
                      <div
                        key={index}
                        className="flex w-full gap-2 py-1 overflow-y-auto text-sm border-b border-slate-700 whitespace-nowrap hover:bg-slate-800 hover:bg-opacity-40"
                      >
                        <span className="font-bold">{name}:</span>
                        <span className="font-light">{value}</span>
                      </div>
                    );
                  })}
                </ul>
              </>
            )}
            {requestList[activeReuquestId]?.responseHeaders && (
              <>
                <div className="text-xl font-black">Response Headers</div>
                <hr />
                <ul>
                  {requestList[activeReuquestId]?.responseHeaders?.map(({ name, value }, index) => {
                    return (
                      <div
                        key={index}
                        className="flex w-full gap-2 py-1 overflow-y-auto text-sm border-b border-slate-700 whitespace-nowrap hover:bg-slate-800 hover:bg-opacity-40"
                      >
                        <span className="font-bold">{name}:</span>
                        <span className="font-light">{value}</span>
                      </div>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </ColorCover>
    </div>
  );
};

export default HTTPLogger;
