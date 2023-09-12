import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Background from '../common/background/background';
import Header from '../header/header';
import Footer from '../footer/footer'
import SideBar from '../sideBar/sideBar'
import RuleRoutes from './routes';
import BrowserSupport from './browserSupport';
import BrowserSupportService from 'src/services/BrowserSupportService';
import 'services/TrackService';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
    return <div className="h-screen w-screen overflow-hidden">
      <ToastContainer 
        position='top-center'
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
        closeButton={false}
        bodyClassName='p-0 shadow-none'
        toastClassName='bg-transparent rounded-none p-0 shadow-none'
        limit={2}
      />
      <Background>
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
    </Background>
  </div>
}

export default App;