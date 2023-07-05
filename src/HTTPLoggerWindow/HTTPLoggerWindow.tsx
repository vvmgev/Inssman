import React from 'react';
import { createRoot } from 'react-dom/client';
import HTTPLogger from 'src/options/pages/httpLogger/httpLogger';
import Background from 'src/options/components/common/background/background';
import { WebRequestClients } from 'src/models/WebRequestModel';
import './HTTPLoggerWindow.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <div className="h-screen w-screen overflow-hidden">
        <Background>
            <div className="m-[10px] h-full">
                <HTTPLogger clientName={WebRequestClients.WINDOW}
                            showOpenWindowBtn={false} />
            </div>
        </Background>
    </div>
);
