import ColorCover from 'common/colorCover/colorCover';
import Logo  from 'assets/icons/logo.svg';
import Button from 'common/button/button';
import ExtensionToggle from 'common/extensionToggle/extensionToggle';
import { useContext } from 'react';
import { OverlayContext } from 'src/context/overlayContext';

const Header =  () => {
  const { showOverlay } = useContext(OverlayContext);
  const onHandleOpen = () => chrome.runtime.openOptionsPage();

  return <ColorCover classes='h-30 py-3 px-2 border-t-0 border-l-0 border-r-0 h-[initial] rounded-none'>
      <div className="flex items-center flex-row justify-between">
          <Logo />
          <div className="flex gap-3 items-center">
              <ColorCover classes="flex justify-between items-center rounded w-[170px]">
                <div className="flex items-center"><ExtensionToggle /></div>
                <div className="text-sm text-end text-white">Extension {showOverlay ? 'On' : 'Off'}</div>
              </ColorCover>
            <Button trackName="Open Application" onClick={onHandleOpen}>Open Application</Button>
          </div>

      </div>
  </ColorCover>
}
export default Header;
