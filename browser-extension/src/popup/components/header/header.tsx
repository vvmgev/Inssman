import ColorCover from "@options/components/common/colorCover/colorCover";
import Button from "@options/components/common/button/button";
import ExtensionToggle from "@options/components/common/extensionToggle/extensionToggle";
import Logo from "@assets/icons/logo.svg";
import { FeatureToggleContext } from "@context/featureToggleContext";
import { useEffect, useState, useContext } from "react";

const Header = () => {
  const [openWebApp, setOpenWebApp] = useState<boolean>(false);
  const { featureOpenWebApp } = useContext(FeatureToggleContext);

  useEffect(() => {
    setOpenWebApp(featureOpenWebApp);
  }, []);

  const onHandleOpen = () => {
    if (openWebApp) {
      chrome.tabs.create({ url: "https://inssman.com/app" });
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <ColorCover classes="h-30 py-3 px-2 border-t-0 border-l-0 border-r-0 h-[initial] rounded-none">
      <div className="flex items-center flex-row justify-between">
        <Logo />
        <div className="flex gap-3 items-center">
          <ExtensionToggle />
          <Button trackName="Open Application" onClick={onHandleOpen}>
            Open Application
          </Button>
        </div>
      </div>
    </ColorCover>
  );
};
export default Header;
