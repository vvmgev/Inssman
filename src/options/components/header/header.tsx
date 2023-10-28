import GithubSVG from 'assets/icons/github.svg'
import DocumentSVG from 'assets/icons/document.svg'
import BugSVG from 'assets/icons/bug.svg'
import ColorCover from 'common/colorCover/colorCover';
import ExtensionToggle from 'common/extensionToggle/extensionToggle';
import { OverlayContext } from 'src/context/overlayContext';
import { useContext } from 'react';
import Tooltip from '../common/tooltip/tooltip';

const Header =  () => {
    const { showOverlay } = useContext(OverlayContext);

    return <div className="flex justify-end max-h-[10%]">
        <ColorCover classes={`overflow-visible flex gap-5 box-border items-center px-5 w-[initial] rounded-tl-none rounded-tr-none rounded-br-none ${!showOverlay ? 'z-20': ''}`}>
          <Tooltip
            isOpen={!showOverlay}
            place="bottom"
            content="Extension is disabled, All modification will not work">
              <div><ExtensionToggle /></div>
          </Tooltip>
        </ColorCover>
        <ColorCover classes="flex gap-5 p-5 w-[initial] rounded-none">
            <a target="_blank" href="https://github.com/vvmgev/Inssman" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<GithubSVG />}</span>Github</a>
            <a target="_blank" href="https://github.com/vvmgev/Inssman#documentation" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<DocumentSVG />}</span>Docs</a>
            <a target="_blank" href="https://github.com/vvmgev/Inssman/issues/new" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<BugSVG />}</span>Report a Bug</a>
        </ColorCover>
    </div>
}
export default Header;
