import { useEffect, useState, useRef, useMemo } from "react";
import { WebRequestListenerType, WebRequestClients } from "@models/WebRequestModel";
import Section from "@options/components/common/section/section";
import Input from "@options/components/common/input/input";
import CrossSVG from "@assets/icons/cross.svg";
import DoubleSquareSVG from "@assets/icons/doubleSquare.svg";
import SearchSVG from "@assets/icons/search.svg";
import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import BackButton from "@options/components/common/backButton/backButton";
import List, { ListHeader, ListItems } from "@/options/components/common/list/list";

const HTTPLogger = ({ clientName, showOpenWindowBtn = true }) => {
  const portRef = useRef<any>();
  const [requestList, setRequestList] = useState<any>({});
  const [activeRequest, setActiveRequest] = useState<any | null>();
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
    setActiveRequest(null);
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

  const onRowClick = (item: any) => {
    setActiveRequest(item);
  };

  const LIST_HEADERS: ListHeader[] = useMemo(() => {
    return [
      {
        title: "ID",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Status Code",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Method",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Type",
        render: function () {
          return this.title;
        },
      },
      {
        title: "IP",
        render: function () {
          return this.title;
        },
      },
      {
        title: "From Cache",
        render: function () {
          return this.title;
        },
      },
      {
        title: "URL",
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
        field: "requestId",
        render: function (item) {
          return item.id;
        },
      },
      {
        field: "statusCode",
        render: function (item) {
          return item[this.field] || "unknown";
        },
      },
      {
        field: "method",
        render: function (item) {
          return item[this.field] || "unknown";
        },
      },
      {
        field: "type",
        render: function (item) {
          return item[this.field] || "unknown";
        },
      },
      {
        field: "ip",
        render: function (item) {
          return item[this.field] || "unknown";
        },
      },
      {
        field: "fromCache",
        render: function (item) {
          return item[this.field] || "unknown";
        },
      },
      {
        field: "url",
        classes: "gap-5 justify-end",
        render: function (item) {
          return <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">{item[this.field]}</div>;
        },
      },
    ];
  }, []);

  const filteredList = Object.entries(requestList)
    .map(([id, request]) => {
      return {
        // @ts-ignore
        ...request,
        id,
      };
    })
    .filter((request) => request.url.includes(search));

  return (
    <div className={`${clientName === WebRequestClients.WINDOW ? "h-[95%]" : "h-[80%]"} mx-[5%] flex flex-col gap-2`}>
      <Section classes={`h-[50%] p-0`}>
        <div className="flex justify-between mb-3 text-sm p-5">
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
          </div>
        </div>
        <List
          headers={LIST_HEADERS}
          items={LIST_ITEMS}
          data={filteredList}
          onRowClick={onRowClick}
          activeRow={activeRequest}
        />
      </Section>
      <Section classes={`h-[50%]`}>
        {activeRequest && (
          <>
            {activeRequest.requestHeaders && (
              <>
                <div className="text-xl font-extrabold">Request Headers</div>
                <hr />
                <ul>
                  {activeRequest.requestHeaders?.map(({ name, value }, index) => {
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
            {activeRequest.responseHeaders && (
              <>
                <div className="text-xl font-black">Response Headers</div>
                <hr />
                <ul>
                  {activeRequest.responseHeaders?.map(({ name, value }, index) => {
                    return (
                      <li
                        key={index}
                        className="flex w-full gap-2 py-1 overflow-y-auto text-sm border-b border-slate-700 hover:bg-slate-800 hover:bg-opacity-40"
                      >
                        <span className="font-bold">{name}:</span>
                        <span className="font-light">{value}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </Section>
    </div>
  );
};

export default HTTPLogger;
