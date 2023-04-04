import React from 'react';
import BackgroundAnimation from 'src/options/components/backgroundAnimation/backgroundAnimation';
import Content from './content/content';
import Footer from './footer/footer';
import Header from './header/header';

const App = () => {
    return <div className='w-[650px] h-[550px]'>
        <BackgroundAnimation>
            <div className="p-[10px] flex flex-col gap-2">
                <Header></Header>
                <Content></Content>
                <Footer></Footer>
            </div>
        </BackgroundAnimation>
    </div>
}

export default App;