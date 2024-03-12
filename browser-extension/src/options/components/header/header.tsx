import Icon from "@options/components/common/icon/icon";
import Section from "@options/components/common/section/section";
import ExtensionToggle from "@options/components/common/extensionToggle/extensionToggle";
import Tooltip from "@options/components/common/tooltip/tooltip";
import { OverlayContext } from "@context/overlayContext";
import { useContext } from "react";

const Header = () => {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <Section className="flex justify-end w-full border border-l-0 border-slate-500 h-[85.5px]">
      <div className={`relative flex items-center ${!showOverlay ? "z-20 " : ""}`}>
        <div className={`overflow-visible px-5 w-[initial] rounded-none`}>
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
      </div>
      <div className="flex gap-3 pr-3">
        <a
          target="_blank"
          href="https://github.com/vvmgev/Inssman"
          className="flex items-center gap-1 hover:text-sky-500"
        >
          {<Icon name="github" />}Github
        </a>
        <a
          target="_blank"
          href="http://localhost:3000/docs/introduction"
          className="flex items-center gap-1 hover:text-sky-500"
        >
          <Icon name="document" />
          Docs
        </a>
        <a
          target="_blank"
          href="https://github.com/vvmgev/Inssman/issues/new"
          className="flex items-center gap-1 hover:text-sky-500"
        >
          <Icon name="bug" />
          Report a Bug
        </a>
      </div>
    </Section>
  );
};
export default Header;
