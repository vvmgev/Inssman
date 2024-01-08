import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import ArrowLeftSVG from "@assets/icons/arrowLeft.svg";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

type Props = {
  trackName: string;
  url?: string;
  text?: string;
};
const BackButton: FC<Props> = ({ trackName, url, text }) => {
  const navigate = useNavigate();

  return (
    <OutlineButton
      trackName={`Back ${trackName}`}
      onClick={() => navigate((url || -1) as string)}
      prefix={<ArrowLeftSVG />}
    >
      {text || "Back"}
    </OutlineButton>
  );
};

export default BackButton;
