import Button from "@options/components/common/button/button";
import Icon from "@options/components/common/icon/icon";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

type Props = {
  trackName?: string;
  url?: string;
  text?: string;
};
const BackButton: FC<Props> = ({ trackName, url, text }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      trackName={`Back ${trackName}`}
      onClick={() => navigate((url || -1) as string)}
      startIcon={<Icon name="arrowLeft" />}
    >
      {text || "Back"}
    </Button>
  );
};

export default BackButton;
