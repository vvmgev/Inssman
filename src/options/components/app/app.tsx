import React from 'react';
import { HashRouter } from 'react-router-dom';
import BackgroundAnimation from '../common/backgroundAnimation/backgroundAnimation';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';
import BrowserSupport from './browserSupport';
import BrowserSupportService from 'src/services/BrowserSupportService';
import 'services/TrackService';

const App = () => {
    return <div className="h-screen w-screen overflow-hidden">
      <BackgroundAnimation>
        <HashRouter>
          <div className="flex flex-row h-full">
            <SideBar />
            <div className="flex flex-col gap-10 w-5/6">
              <Header />
              {BrowserSupportService.isSupportRules() ?  <RuleRoutes /> : <BrowserSupport />}
              <Footer />
            </div>
          </div>
      </HashRouter>
    </BackgroundAnimation>
  </div>
}

export default App;