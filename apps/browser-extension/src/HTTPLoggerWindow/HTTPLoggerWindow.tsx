import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HTTPLogger from "@options/pages/httpLogger/httpLogger";
import Background from "@options/components/common/background/background";
import { WebRequestClients } from "@models/WebRequestModel";
import "./HTTPLoggerWindow.css";

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <div className="w-screen h-screen overflow-hidden">
      <Background>
        <div className="m-[10px] h-full">
          <HTTPLogger clientName={WebRequestClients.WINDOW} showOpenWindowBtn={false} />
        </div>
      </Background>
    </div>
  </StrictMode>
);
