import Icon from "@options/components/common/icon/icon";
import Section from "@options/components/common/section/section";
import ExtensionToggle from "@options/components/common/extensionToggle/extensionToggle";
import { OverlayContext } from "@context/overlayContext";
import { useContext } from "react";
import Tooltip from "@options/components/common/tooltip/tooltip";

const Header = () => {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <Section classes="flex justify-end py-5 border-l-0">
      <div
        className={`overflow-visible flex gap-5 box-border items-center px-5 w-[initial] rounded-none ${
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
      </div>
      <a
        target="_blank"
        href="https://github.com/vvmgev/Inssman"
        className="flex items-center gap-3 hover:text-sky-500"
      >
        {<Icon name="github" />}Github
      </a>
      <a
        target="_blank"
        href="https://github.com/vvmgev/Inssman#documentation"
        className="flex items-center gap-3 hover:text-sky-500"
      >
        <Icon name="document" />
        Docs
      </a>
      <a
        target="_blank"
        href="https://github.com/vvmgev/Inssman/issues/new"
        className="flex items-center gap-3 hover:text-sky-500"
      >
        <Icon name="bug" />
        Report a Bug
      </a>
    </Section>
  );
};
export default Header;
