import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Background from "../common/background/background";
import Header from "../header/header";
import Footer from "../footer/footer";
import SideBar from "../sideBar/sideBar";
import RuleRoutes from "./routes";
import BrowserSupport from "./browserSupport";
import BrowserSupportService from "src/services/BrowserSupportService";
import SideBarContextProvider from "src/context/sideBarContext";
import OverlayContextProvider, {
  OverlayContext,
} from "src/context/overlayContext";
import FeatureToggleProvider from "src/context/featureToggleContext";
import { useContext } from "react";
import "services/TrackService";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showOverlay } = useContext(OverlayContext);
  return (
    <div className="flex flex-row h-full">
      <SideBar />
      <div className="flex flex-col gap-10 w-5/6">
        <Header />
        {!showOverlay && (
          <div className="absolute z-10 bg-black opacity-50 top-0 bottom-0 left-0 right-0"></div>
        )}
        {BrowserSupportService.isSupportRules() ? (
          <RuleRoutes />
        ) : (
          <BrowserSupport />
        )}
        <Footer />
      </div>
    </div>
  );
};

const Wrapper = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
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
              <SideBarContextProvider>
                <App />
              </SideBarContextProvider>
            </OverlayContextProvider>
          </FeatureToggleProvider>
        </HashRouter>
      </Background>
    </div>
  );
};

export default Wrapper;
