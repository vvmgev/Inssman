import React from 'react';
import { HashRouter } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';


const App = () => {
    return <div className="bg-custom-background h-screen text-gray-300 text-sm">
      <HashRouter>
        <div className="inline-block h-full w-1/6">
          <SideBar />
        </div>
        <div className="float-right inline-block h-full w-5/6">
          <div className="h-full flex flex-col justify-between">
            <Header />
            <div className="mx-[10%] max-h-[90%] overflow-y-auto">
              <RuleRoutes />
            </div>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </div>
}

export default App;