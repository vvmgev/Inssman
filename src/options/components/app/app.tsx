import React from 'react';
import { HashRouter } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';


const App = () => {
    return <div className="bg-[linear-gradient(140deg,_rgba(4,_4,_11,_1)_0%,_rgba(28,_25,_28,_1)_25%,__rgba(41,_47,_46,_1)_47%,__rgba(26,_47,_43,_1)_68%,__rgba(14,_13,_28,_1)_85%)] h-screen text-gray-300 text-sm
      before:content-[''] before:inline-block before:w-[300px] before:h-[300px] before:absolute
      before:bg-[linear-gradient(rgba(55,_235,_169,_0.4),rgba(91,_55,_235,_0.4))] before:rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]
      before:animate-backgroundBefore
      before:border-2 before:blur-[50px]
      after:content-[''] after:inline-block after:w-[300px] after:h-[300px] after:absolute
      after:bg-[linear-gradient(rgba(91,_55,_235,_0.4),rgba(55,_235,_169,_0.4))] after:rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]
      after:animate-backgroundAfter
      after:border-2 after:blur-[50px]
      ">
      <HashRouter>
        <div className="inline-block h-full w-1/6 relative z-10">
          <SideBar />
        </div>
        <div className="float-right inline-block h-full w-5/6 relative z-10">
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
