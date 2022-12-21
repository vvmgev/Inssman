import React from 'react';
import { Route, Routes, HashRouter, Link} from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer'
import RuleForm from '../ruleForm/ruleForm'
import CreateRuleList from '../createRuleList/createRuleList';
import RuleList from '../ruleList/ruleList'
import RedirectForm from '../forms/redirectForm/redirectForm';
import Edit from '../editor/editor';

const App = () => {
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
                <br />
                <Link to='create-rule/redirect'>Redirect APP</Link>
                <div className="bg-white rounded-lg m-5 w-[calc(100%-m-5)] mt-10">
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/create-list" element={<CreateRuleList />} />
                        <Route path="/create-rule">
                            <Route path="redirect" element={<RedirectForm />} />  
                        </Route>
                        <Route path="/edit-rule/:id" element={<RuleForm />} />
                    </Routes>
                </div>
            <Footer />
        </HashRouter>
    </div>
}

export default App;