import React from 'react';
import Background from 'src/options/components/common/background/background';
import Content from './content/content';
import Footer from './footer/footer';
import Header from './header/header';

const App = () => {
    return <div className='w-[650px] h-[550px]'>
        <Background>
            <div className="flex flex-col gap-5 justify-between">
                <Header />
                <Content />
                <Footer />
            </div>
        </Background>
    </div>
}

export default App;