import OutlineButton from "common/outlineButton/outlineButton";
import ArrowLeftSVG  from 'assets/icons/arrowLeft.svg';
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return <OutlineButton trackName="Back"
            onClick={() => navigate(-1)}
            icon={<ArrowLeftSVG />}
          >Back
          </OutlineButton>
};


export default BackButton;
