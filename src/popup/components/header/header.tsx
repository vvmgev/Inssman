import ColorCover from 'src/options/components/common/colorCover/colorCover';
import Logo  from 'assets/icons/logo.svg';
import Button from 'src/options/components/common/button/button';

const Header =  () => {
    const onHandleOpen = () => chrome.runtime.openOptionsPage();

    return <ColorCover classes='h-30 py-3 px-2 border-t-0 border-l-0 border-r-0 h-[initial] rounded-none'>
        <div className="flex items-center flex-row justify-between">
            <Logo />
            <Button trackName="Open Application" onClick={onHandleOpen}>Open Application</Button>
        </div>
  </ColorCover>
}
export default Header;