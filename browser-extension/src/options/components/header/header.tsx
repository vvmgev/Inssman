import GithubSVG from "@assets/icons/github.svg";
import DocumentSVG from "@assets/icons/document.svg";
import BugSVG from "@assets/icons/bug.svg";
import ColorCover from "@options/components/common/colorCover/colorCover";
import ExtensionToggle from "@options/components/common/extensionToggle/extensionToggle";
import { OverlayContext } from "@context/overlayContext";
import { useContext } from "react";
import Tooltip from "@options/components/common/tooltip/tooltip";

const Header = () => {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <div className="flex justify-end max-h-[10%]">
      <ColorCover
        classes={`overflow-visible flex gap-5 box-border items-center px-5 w-[initial] rounded-tl-none rounded-tr-none rounded-br-none ${
          !showOverlay ? "z-20" : ""
        }`}
      >
        <Tooltip
          visible={!showOverlay}
          place="bottom"
          content={
            <div className="text-center">
              <p>Extension is disabled</p>
              <p>All modification will not work</p>
            </div>
          }
        >
          <ExtensionToggle />
        </Tooltip>
      </ColorCover>
      <ColorCover classes="flex gap-5 p-5 w-[initial] rounded-none">
        <a
          target="_blank"
          href="https://github.com/Inssman/Inssman"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<GithubSVG />}</span>Github
        </a>
        <a
          target="_blank"
          href="https://github.com/Inssman/Inssman#documentation"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<DocumentSVG />}</span>Docs
        </a>
        <a
          target="_blank"
          href="https://github.com/Inssman/Inssman/issues/new"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<BugSVG />}</span>Report a Bug
        </a>
      </ColorCover>
    </div>
  );
};
export default Header;
