import Section from "@options/components/common/section/section";
import Icon from "@repo/ui/icon";

import TrackService from "@services/TrackService";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useContext, useState } from "react";
import { FeatureToggleContext } from "@context/featureToggleContext";
import { PostMessageAction } from "@models/postMessageActionModel";
import { addProtocol } from "@utils/regExp";

const Footer = () => {
  const [url, setUrl] = useState<string>();
  const { featureShowRecord } = useContext(FeatureToggleContext);
  return (
    <div>
      {featureShowRecord && (
        <Section classes="border-b-0 border-l-0 border-r-0 h-[initial]pt-0 flex flex-col gap-1">
          <div className="m-0 text-sm text-gray-400">Record Session And Replay In Your Browser & Share</div>
          <div className="flex justify-between gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              classes="max-w-[60%]"
              placeholder="Enter URL e.g https://google.com"
            />
            <Button
              startIcon={<Icon name="videoCamera" />}
              onClick={() => {
                if (url) {
                  chrome.runtime.sendMessage(
                    {
                      action: PostMessageAction.StartRecordingByUrl,
                      data: { url: addProtocol(url) },
                    },
                    window.close,
                  );
                } else {
                  chrome.runtime.sendMessage(
                    {
                      action: PostMessageAction.StartRecordingCurrentTab,
                      data: {},
                    },
                    window.close,
                  );
                }
              }}
            >
              Start Recording {url ? "" : "This Tab"}
            </Button>
          </div>
        </Section>
      )}
    </div>
  );
};

export default Footer;
