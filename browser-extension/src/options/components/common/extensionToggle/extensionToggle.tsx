import Switcher from "../switcher/switcher";
import { FC, useContext } from "react";
import { OverlayContext } from "@context/overlayContext";
import Section from "../section/section";

const ExtensionToggle: FC = () => {
  const { showOverlay, setShowOverlay } = useContext(OverlayContext);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowOverlay(event.target.checked);
  };

  return (
    <Section classes="rounded w-[170px]">
      <div className="flex items-center justify-between">
        <Switcher onChange={onChange} checked={showOverlay} />
        <div className="text-sm text-end">Extension {showOverlay ? "On" : "Off"}</div>
      </div>
    </Section>
  );
};

export default ExtensionToggle;
