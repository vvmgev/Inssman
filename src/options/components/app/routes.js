import { Route, Routes } from 'react-router-dom';
import HTTPLogger from 'pages/httpLogger/httpLogger';
import FormHOC from 'options/HOC/formHOC';
import withParams from 'options/HOC/withParams';
import Main from 'components/main/main';
import { WebRequestClients } from 'models/WebRequestModel';

function RuleRoutes() {
  const Form = withParams(FormHOC());

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/create">
        <Route path="redirect" element={<Form key={0} />} />
        <Route path="block" element={<Form key={1} />} />
        <Route path="query-param" element={<Form key={2} />} />
        <Route path="modify-header" element={<Form key={3} />} />
        <Route path="modify-response" element={<Form key={4} />} />
        <Route path="modify-request-body" element={<Form key={5} />} />
        <Route path="inject-file" element={<Form key={6} />} />
        <Route path="http-logger" element={<HTTPLogger clientName={WebRequestClients.MAIN} key={14} />} />
      </Route>
      <Route path="/edit">
        <Route path="redirect/:id" element={<Form key={7} />} />
        <Route path="block/:id" element={<Form key={8} />} />
        <Route path="query-param/:id" element={<Form key={9} />} />
        <Route path="modify-header/:id" element={<Form key={10} />} />
        <Route path="modify-response/:id" element={<Form key={11} />} />
        <Route path="modify-request-body/:id" element={<Form key={12} />} />
        <Route path="inject-file/:id" element={<Form key={13} />} />
      </Route>
      <Route path="/template">
        <Route path="redirect" element={<Form key={30} />} />
        <Route path="block" element={<Form key={31} />} />
        <Route path="query-param" element={<Form key={32} />} />
        <Route path="modify-header" element={<Form key={33} />} />
        <Route path="modify-response" element={<Form key={34} />} />
        <Route path="modify-request-body" element={<Form key={35} />} />
        <Route path="inject-file" element={<Form key={36} />} />
      </Route>
    </Routes>
  );
}

export default RuleRoutes;
