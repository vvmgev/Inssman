import OutlineButton from "common/outlineButton/outlineButton";
import ArrowLeftSVG  from 'assets/icons/arrowLeft.svg';
import { useNavigate } from "react-router-dom";
import { FC } from "react";

type Props = {
  trackName: string,
}
const BackButton: FC<Props> = ({ trackName }) => {
  const navigate = useNavigate();
  return <OutlineButton trackName={`Back ${trackName}`}
            onClick={() => navigate(-1)}
            icon={<ArrowLeftSVG />}
          >Back
          </OutlineButton>
};


export default BackButton;
