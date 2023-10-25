import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';
import { PostMessageAction } from 'src/models/postMessageActionModel';

type OverlayContextValue = {
  showOverlay: boolean;
  setShowOverlay: (checked: boolean) => void
}

export const OverlayContext = createContext({} as OverlayContextValue);

const OverlayContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const getExtensionStatus = () => {
    chrome.runtime.sendMessage({action: PostMessageAction.GetExtensionStatus}, setShowOverlay);
  }
  const handleSetShowOverlay = (checked: boolean) => {
    setShowOverlay(checked);
    chrome.runtime.sendMessage({action: PostMessageAction.ToggleExntesion, data: { checked }});
  }

  useEffect(() => getExtensionStatus(), []);

  return <OverlayContext.Provider value={{showOverlay, setShowOverlay: handleSetShowOverlay}}>
    {children}
  </OverlayContext.Provider>
}

export default OverlayContextProvider;
