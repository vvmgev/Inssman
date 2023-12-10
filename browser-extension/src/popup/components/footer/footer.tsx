import Button from "common/button/button";
import ColorCover from "common/colorCover/colorCover";
import VideoCameraSVG  from 'assets/icons/videoCamera.svg'
import { useContext } from "react";
import { FeatureToggleContext } from "src/context/featureToggleContext";

const Footer = () => {
  const { toggles } = useContext(FeatureToggleContext);
  return <div>
    {toggles.featureShowRecord &&  <ColorCover classes="border-b-0 border-l-0 border-r-0 h-[initial] rounded-none py-5">
      <div className="w-full h-full flex justify-between items-center">
        <div className="px-3">
          <div className="text-md">Record Session And Replay In Your Browser & Share</div>
          <div className="text-md">
            <span className="font-bold">Note: </span>
            <span className="text-slate-400">All Recorded Sessions Are Stored On Your Device</span>
          </div>
        </div>
        <div>
          <Button
            icon={<VideoCameraSVG />}
            trackName="Start Recording Popup"
            onClick={() => {
              chrome.tabs.create({ url: 'https://google.com' })
            }}>
              Start Recording
          </Button>
        </div>
      </div>
    </ColorCover>}
  </div>
}

export default Footer;
