import React from 'react';
import { Route, Routes, HashRouter, Link} from 'react-router-dom';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer'
import CreateRuleForm from '../createRuleForm/createRuleForm'
import RuleList from '../ruleList/ruleList'
import Edit from '../editor/editor';

export default () => {

    return <div className="bg-gray-200 h-screen border-2 border-gray-200">
        <HashRouter>
            <Header />
                <Link to='/'>main</Link>
                <br />
                <Link to='create-list'>Create list</Link>
                <br />
                <Link to='create-rule'>Create rule</Link>
                <br />
                <Link to='edit'>Edit</Link>
                <div className="bg-white rounded-lg m-5 w-[calc(100%-m-5)] mt-10">
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/create-list" element={<Content />} />
                        <Route path="/create-rule" element={<CreateRuleForm />} />
                    </Routes>
                </div>
            <Footer />
        </HashRouter>
    </div>
}