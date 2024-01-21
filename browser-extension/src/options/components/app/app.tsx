import FeatureToggleProvider from "@context/featureToggleContext";
import Background from "@options/components/common/background/background";
import Header from "../header/header";
import Footer from "../footer/footer";
import Sidebar from "../sidebar/sidebar";
import RuleRoutes from "./routes";
import BrowserSupport from "./browserSupport";
import SidebarContextProvider, { SidebarContext } from "@context/sidebarContext";
import OverlayContextProvider, { OverlayContext } from "@context/overlayContext";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { HashRouter } from "react-router-dom";
import "@services/TrackService";
import "react-toastify/dist/ReactToastify.css";
import Section from "../common/section/section";

const App = () => {
  const { showOverlay } = useContext(OverlayContext);
  const { full, setFull } = useContext(SidebarContext);

  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <BrowserSupport>
          {!showOverlay && <div className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-50"></div>}
          <Section classes="w-full h-full">
            <RuleRoutes />
          </Section>
        </BrowserSupport>
        <Footer />
      </div>
    </div>
  );
};

const Wrapper = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
        closeButton={false}
        bodyClassName="p-0 shadow-none"
        toastClassName="bg-transparent rounded-none p-0 shadow-none"
        limit={2}
      />
      <Background>
        <HashRouter>
          <FeatureToggleProvider>
            <OverlayContextProvider source="options">
              <SidebarContextProvider>
                <App />
              </SidebarContextProvider>
            </OverlayContextProvider>
          </FeatureToggleProvider>
        </HashRouter>
      </Background>
    </>
  );
};

export default Wrapper;
