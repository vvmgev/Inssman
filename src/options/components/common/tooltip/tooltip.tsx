import React from 'react';
import Popup from 'reactjs-popup';
import { EventType } from 'reactjs-popup/dist/types';
import './tooltip.css';


const Tooltip = ({ children, triggerElement, actions = [] }:
     { children: JSX.Element, triggerElement: JSX.Element, actions?: EventType[]} 
    ): JSX.Element => {
    return <Popup
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