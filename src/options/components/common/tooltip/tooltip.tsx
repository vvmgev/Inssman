import { PropsWithChildren } from 'react';
import Popup from 'reactjs-popup';
import { EventType, PopupPosition } from 'reactjs-popup/dist/types';
import './tooltip.css';

type Props = PropsWithChildren<{
    triggerElement: JSX.Element,
    actions?: EventType[],
    position?: PopupPosition | PopupPosition[],
    open?: boolean;
    closeOnDocumentClick?: boolean;
}>

const Tooltip = ({ children, triggerElement, open, closeOnDocumentClick = true, position = 'top center', actions = [] }: Props
    ): JSX.Element => {
    return <Popup
        mouseEnterDelay={500}
        className="tooltip"
        on={actions}
        trigger={() => triggerElement}
        position={position}
        open={open}
        closeOnDocumentClick={closeOnDocumentClick}
    >
        <span>{children}</span>
  </Popup>
}


export default Tooltip;
