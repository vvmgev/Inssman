import Button from "common/button/button";
import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import VideoCameraSVG from "assets/icons/videoCamera.svg";
import { useContext, useRef, useState } from "react";
import { FeatureToggleContext } from "src/context/featureToggleContext";
import { PostMessageAction } from "models/postMessageActionModel";
import { addProtocol } from "src/utils";

const Footer = () => {
  const [url, setUrl] = useState<string>();
  const searchRef = useRef<HTMLInputElement>();
  const { featureShowRecord } = useContext(FeatureToggleContext);
  return (
    <div>
      {featureShowRecord && (
        <ColorCover classes="border-b-0 border-l-0 border-r-0 h-[initial] rounded-none pt-0 flex flex-col gap-1">
          <div className="text-sm m-0 text-gray-400">
            Record Session And Replay In Your Browser & Share
          </div>
          <div className="flex gap-2 justify-between">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              classes="w-full"
              placeholder="Enter URL e.g https://google.com"
            />
            <Button
              icon={<VideoCameraSVG />}
              trackName="Start Recording Popup"
              classes="whitespace-nowrap"
              onClick={() => {
                const url = searchRef.current?.value || "";
                if (searchRef.current?.value) {
                  chrome.runtime.sendMessage(
                    {
                      action: PostMessageAction.StartRecordingByUrl,
                      data: { url: addProtocol(url) },
                    },
                    window.close
                  );
                } else {
                  chrome.runtime.sendMessage(
                    {
                      action: PostMessageAction.StartRecordingByCurrentTab,
                      data: {},
                    },
                    window.close
                  );
                }
              }}
            >
              Start Recording {url ? "" : "This Tab"}
            </Button>
          </div>
        </ColorCover>
      )}
    </div>
  );
};

export default Footer;
