import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RuleList from '../ruleList/ruleList'
import RedirectForm from '../forms/redirect/redirect';
import CancelForm from '../forms/block/block';
import QueryParamForm from '../forms/queryParam/queryParam';
import ModifyHeaderForm from '../forms/modifyHeader/modifyHeader';
import ModifyAPIResponseForm from '../forms/modifyResponse/modifyResponse';
import FormHOC from '../HOC/formHOC';
import withParams from '../HOC/withParams';

const RuleRoutes = () => {
  const RedirectFormHOC = withParams(FormHOC(RedirectForm));
  const CancelFormHOC = withParams(FormHOC(CancelForm));
  const QueryParamFormHOC = withParams(FormHOC(QueryParamForm));
  const ModifyHeaderFormHOC = withParams(FormHOC(ModifyHeaderForm));
  const ModifyAPIResponseFormHOC = withParams(FormHOC(ModifyAPIResponseForm));

  return <Routes>
    <Route path="/" element={<RuleList />} />
    <Route path="/create-rule">
        <Route path="redirect" element={<RedirectFormHOC key={0} />} />  
        <Route path="block" element={<CancelFormHOC key={1} />} />  
        <Route path="query-param" element={<QueryParamFormHOC key={2} />} />  
        <Route path="modify-header" element={<ModifyHeaderFormHOC key={3} />} />  
        <Route path="modify-response" element={<ModifyAPIResponseFormHOC key={4} />} />  
    </Route>
    <Route path="/edit-rule">
        <Route path="redirect/:id" element={<RedirectFormHOC key={5} />} />  
        <Route path="block/:id" element={<CancelFormHOC key={6} />} />  
        <Route path="query-param/:id" element={<QueryParamFormHOC key={6} />} />  
        <Route path="modify-header/:id" element={<ModifyHeaderFormHOC key={7} />} />  
        <Route path="modify-response/:id" element={<ModifyAPIResponseFormHOC key={8} />} />  
    </Route>
  </Routes>
}

export default RuleRoutes