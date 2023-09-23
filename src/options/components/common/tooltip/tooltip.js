import Popup from 'reactjs-popup';
import './tooltip.css';

function Tooltip({ children, triggerElement, actions = [] }) {
  return (
    <Popup
      mouseEnterDelay={500}
      className="tooltip"
      on={actions}
      trigger={() => triggerElement}
      position="top center"
      closeOnDocumentClick
    >
      <span>{children}</span>
    </Popup>
  );
}

export default Tooltip;
