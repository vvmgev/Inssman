import React from 'react';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import Logo  from 'assets/images/logo.svg';
import Button from 'src/options/components/common/button/button';

const Header =  () => {
    const onHandleOpen = () => chrome.runtime.openOptionsPage();

    return <ColorCover classes='h-30 py-3 px-2 h-[initial]'>
        <div className="flex items-center flex-row justify-between">
            <Logo />
            <Button trackName="Open Options" onClick={onHandleOpen}>Open Application</Button>
        </div>
  </ColorCover>
}
export default Header;