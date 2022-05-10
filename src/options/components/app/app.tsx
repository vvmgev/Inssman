import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer'
import CreateRuleForm from '../createRuleForm/createRuleForm'

export default () => {

    return <div className="bg-gray-200 h-screen border-2 border-gray-200">
        <HashRouter>
            <Header />
                <div className="bg-white rounded-lg m-5 w-[calc(100%-m-5)] mt-10">
                    <Routes>
                        <Route path="/" element={<Content />} />
                        <Route path="/create" element={<CreateRuleForm />} />
                    </Routes>
                </div>
            <Footer />
        </HashRouter>
    </div>
}