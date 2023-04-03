import React from 'react';
import { createRoot } from 'react-dom/client';
import HTTPLogger from 'src/options/components/pages/httpLogger/httpLogger';
import BackgroundAnimation from 'src/options/components/backgroundAnimation/backgroundAnimation';
import { WebRequestClients } from 'src/models/WebRequestModel';
import './HTTPLoggerPopup.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BackgroundAnimation>
        <div className="m-[10px] h-full">
            <HTTPLogger clientName={WebRequestClients.POPUP}
                        showOpenWindowBtn={false}
                        infoBoxClasses="!max-h-[50%] !h-[50%]"
                        listBoxClasses="!max-h-[50%] !h-[47%]" />
        </div>
    </BackgroundAnimation>
);
