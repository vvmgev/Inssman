import ColorCover from 'common/colorCover/colorCover';
import Logo  from 'assets/icons/logo.svg';
import Button from 'common/button/button';
import ExtensionToggle from 'common/extensionToggle/extensionToggle';
import { useEffect, useState } from 'react';

const Header =  () => {
  const [openWebApp, setOpenWebApp] = useState<boolean>(false);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await fetch('https://inssman.com/api/config');
        const config = await res.json();
        setOpenWebApp(config.featureToggles.shouldOpenWebApp);
      } catch (error) {
        setOpenWebApp(false);
      }
    }
    makeRequest();
  }, []);

  const onHandleOpen = () => {
    if(openWebApp) {
      chrome.tabs.create({url: "https://inssman.com/app"});
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  return <ColorCover classes='h-30 py-3 px-2 border-t-0 border-l-0 border-r-0 h-[initial] rounded-none'>
      <div className="flex items-center flex-row justify-between">
          <Logo />
          <div className="flex gap-3 items-center">
            <ExtensionToggle />
            <Button trackName="Open Application" onClick={onHandleOpen}>Open Application</Button>
          </div>
      </div>
  </ColorCover>
}
export default Header;
