import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RedirectForm from 'pages/redirect/redirect';
import CancelForm from 'pages/block/block';
import QueryParamForm from 'pages/queryParam/queryParam';
import ModifyHeaderForm from 'pages/modifyHeader/modifyHeader';
import ModifyResponseForm from 'pages/modifyResponse/modifyResponse';
import InjectFileForm from 'pages/injectFile/injectFile';
import ModifyRequestBodyForm from 'pages/modifyRequestBody/modifyRequestBody';
import HTTPLogger from 'pages/httpLogger/httpLogger';
import FormHOC from 'options/HOC/formHOC';
import withParams from 'options/HOC/withParams';
import RuleList from 'components/ruleList/ruleList'
import { WebRequestClients } from 'models/WebRequestModel';

const RuleRoutes = () => {
  const RedirectFormHOC = withParams(FormHOC(RedirectForm));
  const CancelFormHOC = withParams(FormHOC(CancelForm));
  const QueryParamFormHOC = withParams(FormHOC(QueryParamForm));
  const ModifyHeaderFormHOC = withParams(FormHOC(ModifyHeaderForm));
  const ModifyResponseFormHOC = withParams(FormHOC(ModifyResponseForm));
  const InjectFileFormHOC = withParams(FormHOC(InjectFileForm));
  const ModifyRequestBodyFormHOC = withParams(FormHOC(ModifyRequestBodyForm));

  return <Routes>
    <Route path="/" element={<RuleList />} />
    <Route path="/create">
        <Route path="redirect" element={<RedirectFormHOC key={0} />} />
        <Route path="block" element={<CancelFormHOC key={1} />} />
        <Route path="query-param" element={<QueryParamFormHOC key={2} />} />
        <Route path="modify-header" element={<ModifyHeaderFormHOC key={3} />} />
        <Route path="modify-response" element={<ModifyResponseFormHOC key={4} />} />
        <Route path="modify-request-body" element={<ModifyRequestBodyFormHOC key={5} />} />
        <Route path="inject-file" element={<InjectFileFormHOC key={6} />} />
        <Route path="http-logger" element={<HTTPLogger clientName={WebRequestClients.MAIN} key={14} />} />
    </Route>
    <Route path="/edit">
        <Route path="redirect/:id" element={<RedirectFormHOC key={7} />} />
        <Route path="block/:id" element={<CancelFormHOC key={8} />} />
        <Route path="query-param/:id" element={<QueryParamFormHOC key={9} />} />
        <Route path="modify-header/:id" element={<ModifyHeaderFormHOC key={10} />} />
        <Route path="modify-response/:id" element={<ModifyResponseFormHOC key={11} />} />
        <Route path="modify-request-body/:id" element={<ModifyRequestBodyFormHOC key={12} />} />
        <Route path="inject-file/:id" element={<InjectFileFormHOC key={13} />} />
    </Route>
    <Route path="/template">
        <Route path="redirect" element={<RedirectFormHOC key={30} />} />
        <Route path="block" element={<CancelFormHOC key={31} />} />
        <Route path="query-param" element={<QueryParamFormHOC key={32} />} />
        <Route path="modify-header" element={<ModifyHeaderFormHOC key={33} />} />
        <Route path="modify-response" element={<ModifyResponseFormHOC key={34} />} />
        <Route path="modify-request-body" element={<ModifyRequestBodyFormHOC key={35} />} />
        <Route path="inject-file" element={<InjectFileFormHOC key={36} />} />
    </Route>
  </Routes>
}

export default RuleRoutes