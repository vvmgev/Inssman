import Icon from "@repo/ui/icon";

import { useNavigate } from "react-router-dom";
import { FC } from "react";
import { Button } from "@repo/ui/button";

type Props = {
  url?: string;
  text?: string;
};
const BackButton: FC<Props> = ({ url, text }) => {
  const navigate = useNavigate();

  return (
    <Button variant="outline" onClick={() => navigate((url || -1) as string)} startIcon={<Icon name="arrowLeft" />}>
      {text || "Back"}
    </Button>
  );
};

export default BackButton;
