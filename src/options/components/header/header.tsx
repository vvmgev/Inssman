import React from 'react';
import GithubSVG from 'assets/icons/github.svg'
import DocumentSVG from 'assets/icons/document.svg'
import BugSVG from 'assets/icons/bug.svg'
import ColorCover from '../common/colorCover/colorCover';


const Header =  () => {
    return <div className="flex justify-end max-h-[10%]">
        <ColorCover classes="flex gap-5 p-5 py-7 h-30 w-[initial] rounded-tl-none rounded-tr-none rounded-br-none">
            <a target="_blank" href="https://github.com/vvmgev/Inssman" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<GithubSVG />}</span>Github</a>
            <a target="_blank" href="https://github.com/vvmgev/Inssman#documentation" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<DocumentSVG />}</span>Docs</a>
            <a target="_blank" href="https://github.com/vvmgev/Inssman/issues/new" className="flex gap-3 items-center hover:text-sky-500"><span className="w-[24px]">{<BugSVG />}</span>Report a Bug</a>
        </ColorCover>
    </div>
}
export default Header;