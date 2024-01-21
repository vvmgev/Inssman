import Background from "@options/components/common/background/background";
import OverlayContextProvider, { OverlayContext } from "@context/overlayContext";
import FeatureToggleProvider from "@context/featureToggleContext";
import Content from "./content/content";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useContext } from "react";
import { HashRouter } from "react-router-dom";
import Section from "@/options/components/common/section/section";

const App = () => {
  const { showOverlay } = useContext(OverlayContext);
  return (
    <div className="w-[650px]">
      <Background>
        {!showOverlay && <div className="absolute z-10 bg-black opacity-50 top-[85px] bottom-0 left-0 right-0"></div>}
        <div className="flex flex-col justify-between gap-1">
          <Header />
          <Content />
          <Footer />
        </div>
      </Background>
    </div>
  );
};

const Wrapper = () => {
  return (
    <HashRouter>
      <FeatureToggleProvider>
        <OverlayContextProvider>
          <App />
        </OverlayContextProvider>
      </FeatureToggleProvider>
    </HashRouter>
  );
};

export default Wrapper;
