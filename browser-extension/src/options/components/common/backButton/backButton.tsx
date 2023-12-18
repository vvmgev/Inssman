import OutlineButton from "common/outlineButton/outlineButton";
import ArrowLeftSVG from "assets/icons/arrowLeft.svg";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

type Props = {
  trackName: string;
  url?: string;
};
const BackButton: FC<Props> = ({ trackName, url }) => {
  const navigate = useNavigate();

  return (
    <OutlineButton
      trackName={`Back ${trackName}`}
      onClick={() => navigate((url || -1) as string)}
      icon={<ArrowLeftSVG />}
    >
      Back
    </OutlineButton>
  );
};

export default BackButton;
