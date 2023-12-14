import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { PageSource } from "src/models/pageSource";
import { PostMessageAction } from "src/models/postMessageActionModel";

type OverlayContextValue = {
  showOverlay: boolean;
  setShowOverlay: (checked: boolean) => void;
};

type Props = PropsWithChildren<{
  source?: string;
}>;

export const OverlayContext = createContext({} as OverlayContextValue);

const OverlayContextProvider: FC<Props> = ({ children, source = "" }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const getExtensionStatus = () => {
    chrome.runtime.sendMessage(
      { action: PostMessageAction.GetExtensionStatus },
      setShowOverlay
    );
  };
  const handleSetShowOverlay = (checked: boolean) => {
    setShowOverlay(checked);
    chrome.runtime.sendMessage({
      action: PostMessageAction.ToggleExntesion,
      data: { checked },
    });
  };

  useEffect(() => getExtensionStatus(), []);

  const onMessage = useCallback((response, _, sendResponse) => {
    const { action, data } = response;
    if (action === PostMessageAction.ToggleExntesionOptions) {
      setShowOverlay(data.checked);
      sendResponse();
    }
  }, []);

  useEffect(() => {
    if (source === PageSource.Options) {
      chrome.runtime.onMessage.addListener(onMessage);
      return () => {
        chrome.runtime.onMessage.removeListener(onMessage);
      };
    }
  }, []);

  return (
    <OverlayContext.Provider
      value={{ showOverlay, setShowOverlay: handleSetShowOverlay }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export default OverlayContextProvider;
