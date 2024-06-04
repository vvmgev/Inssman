import { Outlet, useLocation } from "react-router-dom";
import { FC, PropsWithChildren, useEffect } from "react";
import { PostMessageAction } from "@/models/postMessageActionModel";

const RouteListener: FC<PropsWithChildren<any>> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window !== window.parent) {
      chrome.runtime.sendMessage({ action: PostMessageAction.URLChanged, data: { pathname } }, () => {});
    }
  }, [pathname]);

  return <Outlet />;
};

export default RouteListener;
