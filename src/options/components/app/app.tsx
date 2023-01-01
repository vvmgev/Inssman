import React from 'react';
import { Route, Routes, HashRouter, Link} from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer'
import RuleForm from '../ruleForm/ruleForm'
import CreateRuleList from '../createRuleList/createRuleList';
import RuleList from '../ruleList/ruleList'
import RedirectForm from '../forms/redirect/redirect';
import CancelForm from '../forms/block/block';
import Edit from '../editor/editor';
import QueryParamForm from '../forms/queryParam/queryParam';

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
                <Link to='create-rule/redirect'>Redirect</Link>
                <br />
                <Link to='create-rule/block'>Block</Link>
                <br />
                <Link to='create-rule/query-param'>Query Param</Link>
                <div className="bg-white rounded-lg m-5 w-[calc(100%-m-5)] mt-10">
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/create-list" element={<CreateRuleList />} />
                        <Route path="/create-rule">
                            <Route path="redirect" element={<RedirectForm />} />  
                            <Route path="block" element={<CancelForm />} />  
                            <Route path="query-param" element={<QueryParamForm />} />  
                        </Route>
                        <Route path="/edit-rule">
                            <Route path="redirect/:id" element={<RedirectForm />} />  
                            <Route path="block/:id" element={<CancelForm />} />  
                            <Route path="query-param/:id" element={<QueryParamForm />} />  
                        </Route>
                    </Routes>
                </div>
            <Footer />
        </HashRouter>
    </div>
}

export default App;