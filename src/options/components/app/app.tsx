import React from 'react';
import { HashRouter } from 'react-router-dom';
import BackgroundAnimation from '../backgroundAnimation/backgroundAnimation';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';

const App = () => {
    return <BackgroundAnimation>
      <HashRouter>
        <div className="inline-block h-full w-1/6 relative z-10">
          <SideBar />
        </div>
        <div className="float-right inline-block h-full w-5/6 relative z-10">
          <div className="h-full flex flex-col justify-between">
            <Header />
            <div className="min-h-[350px] mx-[10%] max-h-[80%] overflow-y-auto">
              <RuleRoutes />
            </div>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </BackgroundAnimation>
}

export default App;
