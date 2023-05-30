import React from 'react';
import { HashRouter } from 'react-router-dom';
import BackgroundAnimation from '../common/backgroundAnimation/backgroundAnimation';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';
import BrowserSupport from './browserSupport';
import 'services/TrackService';
import BrowserSupportService from 'src/services/BrowserSupportService';

const App = () => {
    return <div className="h-screen w-screen overflow-hidden">
      <BackgroundAnimation>
        <HashRouter>
          <div className="inline-block h-full w-1/6 relative z-10">
            <SideBar />
          </div>
          <div className="float-right inline-block h-full w-5/6 relative z-10">
            <div className="h-full flex flex-col justify-between">
              <div className="h-[10%]">
                <Header />
              </div>
              <div className="h-[75%] mx-[10%]">
                  {!BrowserSupportService.isSupportRules() ? <BrowserSupport /> : <RuleRoutes />}
              </div>
              <div className="h-[10%]">
                <Footer />
              </div>
            </div>
          </div>
      </HashRouter>
    </BackgroundAnimation>
  </div>
}

export default App;