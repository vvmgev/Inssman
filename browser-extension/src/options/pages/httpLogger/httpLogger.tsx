import Section from "@options/components/common/section/section";
import Input from "@options/components/common/input/input";
import Icon from "@options/components/common/icon/icon";
import Button from "@options/components/common/button/button";
import BackButton from "@options/components/common/backButton/backButton";
import List from "@/options/components/common/list/list";
import { WebRequestListenerType, WebRequestClients } from "@models/WebRequestModel";
import { useEffect, useState, useRef } from "react";
import { LIST_HEADERS, LIST_ITEMS } from "./list.config";

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
    <div className="flex flex-col h-full gap-2 bg-slate-800 bg-opacity-40">
      <Section classes="h-[50%] p-0 border-0">
        <Section classes="flex justify-between px-2 py-4 text-sm border-0 border-b border-r">
          {showOpenWindowBtn && <BackButton trackName="HTTPLogger" />}
          <div className="flex items-center justify-end gap-5 ">
            {showOpenWindowBtn && (
              <Button
                variant="outline"
                trackName="Open In Window"
                onClick={handleOpenWindow}
                startIcon={<Icon name="doubleSquare" />}
              >
                Open In Window
              </Button>
            )}
            <Button
              variant="outline"
              trackName="Clear Logs"
              onClick={handleClearLogs}
              startIcon={<Icon name="cross" />}
            >
              Clear Logs
            </Button>
            <div className="w-[250px]">
              <Input
                placeholder="Search By URL"
                onChange={onChangeSearch}
                value={search}
                startIcon={<Icon name="search" />}
                endIcon={<Icon name="cross" onClick={onHandleClearSearch} className="hover:text-red-400" />}
              />
            </div>
          </div>
        </Section>
        <List
          headers={LIST_HEADERS}
          items={LIST_ITEMS}
          data={filteredList}
          onRowClick={onRowClick}
          activeRow={activeRequest}
        />
      </Section>
      <Section classes="h-[50%] border-0 border-t">
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
