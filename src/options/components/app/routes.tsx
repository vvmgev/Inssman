import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RuleList from '../ruleList/ruleList'
import RedirectForm from '../forms/redirect/redirect';
import CancelForm from '../forms/block/block';
import QueryParamForm from '../forms/queryParam/queryParam';
import ModifyHeaderForm from '../forms/modifyHeader/modifyHeader';
import ModifyResponseForm from '../forms/modifyResponse/modifyResponse';
import FormHOC from 'src/options/HOC/formHOC';
import withParams from 'src/options/HOC/withParams';
import InjectFileForm from '../forms/injectFile/injectFile';

const RuleRoutes = () => {
  const RedirectFormHOC = withParams(FormHOC(RedirectForm));
  const CancelFormHOC = withParams(FormHOC(CancelForm));
  const QueryParamFormHOC = withParams(FormHOC(QueryParamForm));
  const ModifyHeaderFormHOC = withParams(FormHOC(ModifyHeaderForm));
  const ModifyResponseFormHOC = withParams(FormHOC(ModifyResponseForm));
  const InjectFileFormHOC = withParams(FormHOC(InjectFileForm));

  return <Routes>
    <Route path="/" element={<RuleList />} />
    <Route path="/create-rule">
        <Route path="redirect" element={<RedirectFormHOC key={0} />} />
        <Route path="block" element={<CancelFormHOC key={1} />} />
        <Route path="query-param" element={<QueryParamFormHOC key={2} />} />
        <Route path="modify-header" element={<ModifyHeaderFormHOC key={3} />} />
        <Route path="modify-response" element={<ModifyResponseFormHOC key={4} />} />
        <Route path="inject-file" element={<InjectFileFormHOC key={5} />} />
    </Route>
    <Route path="/edit-rule">
        <Route path="redirect/:id" element={<RedirectFormHOC key={6} />} />
        <Route path="block/:id" element={<CancelFormHOC key={7} />} />
        <Route path="query-param/:id" element={<QueryParamFormHOC key={8} />} />
        <Route path="modify-header/:id" element={<ModifyHeaderFormHOC key={9} />} />
        <Route path="modify-response/:id" element={<ModifyResponseFormHOC key={10} />} />
        <Route path="inject-file/:id" element={<InjectFileFormHOC key={11} />} />
    </Route>
  </Routes>
}

export default RuleRoutes