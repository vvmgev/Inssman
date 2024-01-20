import Icon from "@options/components/common/icon/icon";
import Section from "@options/components/common/section/section";
import ExtensionToggle from "@options/components/common/extensionToggle/extensionToggle";
import { OverlayContext } from "@context/overlayContext";
import { useContext } from "react";
import Tooltip from "@options/components/common/tooltip/tooltip";

const Header = () => {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <div className="flex justify-end max-h-[10%]">
      <Section
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
      </Section>
      <Section classes="flex gap-5 p-5 w-[initial] rounded-none">
        <a
          target="_blank"
          href="https://github.com/vvmgev/Inssman"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<Icon name="github" />}</span>Github
        </a>
        <a
          target="_blank"
          href="https://github.com/vvmgev/Inssman#documentation"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<Icon name="document" />}</span>Docs
        </a>
        <a
          target="_blank"
          href="https://github.com/vvmgev/Inssman/issues/new"
          className="flex items-center gap-3 hover:text-sky-500"
        >
          <span className="w-[24px]">{<Icon name="bug" />}</span>Report a Bug
        </a>
      </Section>
    </div>
  );
};
export default Header;
