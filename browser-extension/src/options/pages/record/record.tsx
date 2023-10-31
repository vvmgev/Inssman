import { ReactElement, useState, FC } from "react";
import ColorCover from "common/colorCover/colorCover";
import Input from "common/input/input";
import Button from "src/options/components/common/button/button";
import { PostMessageAction } from "src/models/postMessageActionModel";


const Record: FC = (): ReactElement => {
  const [url, setUrl] = useState<string>('https://google.com');
  const startRecording = () => {
    chrome.runtime.sendMessage({ action: PostMessageAction.StartRecording, data: { url }}, () => {

    })
  }

  const onChangeUrl = (event) => {
    setUrl(event.target.value)
  };

  return <ColorCover classes="mx-[5%] p-5">
    <div className="flex gap-5">
      <Input value={url} onChange={onChangeUrl} classes="w-1/3" placeholder="e.g https://google.com"/>
      <Button onClick={startRecording} trackName="Start Recording">Start Recording</Button>
    </div>
  </ColorCover>
};

export default Record;
