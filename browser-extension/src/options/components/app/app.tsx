import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Background from "@options/components/common/background/background";
import Header from "../header/header";
import Footer from "../footer/footer";
import SideBar from "../sideBar/sideBar";
import RuleRoutes from "./routes";
import BrowserSupport from "./browserSupport";
import SideBarContextProvider, {
  SideBarContext,
} from "@context/sideBarContext";
import FeatureToggleProvider from "@context/featureToggleContext";
import OverlayContextProvider, {
  OverlayContext,
} from "@context/overlayContext";
import { useContext } from "react";
import "@services/TrackService";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showOverlay } = useContext(OverlayContext);
  const { full, setFull } = useContext(SideBarContext);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-col gap-10 w-full">
        <Header />
        <BrowserSupport>
          {!showOverlay && (
            <div className="absolute z-10 bg-black opacity-50 top-0 bottom-0 left-0 right-0"></div>
          )}
          <RuleRoutes />
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
              <SideBarContextProvider>
                <App />
              </SideBarContextProvider>
            </OverlayContextProvider>
          </FeatureToggleProvider>
        </HashRouter>
      </Background>
    </>
  );
};

export default Wrapper;
