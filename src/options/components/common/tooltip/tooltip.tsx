import React from 'react';
import Popup from 'reactjs-popup';
import { EventType } from 'reactjs-popup/dist/types';
import './tooltip.css';
import { PropsWithChildren } from 'src/types';

type Props = PropsWithChildren<{
    triggerElement: JSX.Element, 
    actions?: EventType[]
}>

const Tooltip = ({ children, triggerElement, actions = [] }: Props
    ): JSX.Element => {
    return <Popup
        mouseEnterDelay={500}
        className="tooltip"
        on={actions}
        trigger={() => triggerElement}
        position="top center"
        closeOnDocumentClick
    >
        <span>{children}</span>
  </Popup>
}


export default Tooltip;