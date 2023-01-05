import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateRuleList from '../createRuleList/createRuleList';
import RuleList from '../ruleList/ruleList'
import RedirectForm from '../forms/redirect/redirect';
import CancelForm from '../forms/block/block';
import QueryParamForm from '../forms/queryParam/queryParam';
import ModifyHeaderForm from '../forms/modifyHeader/modifyHeader';
import ModifyAPIResponseForm from '../forms/ModifyAPIResponse/ModifyAPIResponse';
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
    <Route path="/create-list" element={<CreateRuleList />} />
    <Route path="/create-rule">
        <Route path="redirect" element={<RedirectFormHOC />} />  
        <Route path="block" element={<CancelFormHOC />} />  
        <Route path="query-param" element={<QueryParamFormHOC />} />  
        <Route path="modify-header" element={<ModifyHeaderFormHOC />} />  
        <Route path="modify-response" element={<ModifyAPIResponseFormHOC />} />  
    </Route>
    <Route path="/edit-rule">
        <Route path="redirect/:id" element={<RedirectFormHOC />} />  
        <Route path="block/:id" element={<CancelFormHOC />} />  
        <Route path="query-param/:id" element={<QueryParamFormHOC />} />  
        <Route path="modify-header/:id" element={<ModifyHeaderFormHOC />} />  
        <Route path="modify-response/:id" element={<ModifyAPIResponseFormHOC />} />  
    </Route>
  </Routes>
}

export default RuleRoutes