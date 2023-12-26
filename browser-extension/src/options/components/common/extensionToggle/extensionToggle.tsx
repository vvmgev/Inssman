import Switcher from "../switcher/switcher";
import { FC, useContext } from "react";
import { OverlayContext } from "@context/overlayContext";
import ColorCover from "../colorCover/colorCover";

const ExtensionToggle: FC = () => {
  const { showOverlay, setShowOverlay } = useContext(OverlayContext);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowOverlay(event.target.checked);
  };

  return (
    <ColorCover classes="rounded w-[170px]">
      <div className="flex items-center justify-between">
        <Switcher onChange={onChange} checked={showOverlay} />
        <div className="text-sm text-end">Extension {showOverlay ? "On" : "Off"}</div>
      </div>
    </ColorCover>
  );
};

export default ExtensionToggle;
