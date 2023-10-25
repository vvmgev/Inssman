import Switcher from "../switcher/switcher";
import { FC, useContext } from "react";
import { OverlayContext } from "src/context/overlayContext";


const ExtensionToggle: FC = () => {
  const { showOverlay, setShowOverlay } = useContext(OverlayContext);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowOverlay(event.target.checked);
  }

  return <Switcher onChange={onChange} checked={showOverlay} />
};

export default ExtensionToggle;
