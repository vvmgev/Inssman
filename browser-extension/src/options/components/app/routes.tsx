import RouteListener from "@options/components/routeListener/routeListener";
import HTTPLogger from "@options/pages/httpLogger/httpLogger";
import Record from "@options/pages/record/record";
import SessionList from "@options/pages/sessionList/sessionList";
import SessionDetails from "@/options/pages/sessionDetails/sessionDetails";
import Main from "@options/components/main/main";
import NotFound from "@options/components/notFound/notFound";
import RuleForm from "@options/pages/ruleForm/ruleForm";
import { WebRequestClients } from "@models/WebRequestModel";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RouteListener />}>
        <Route path="/" element={<Main />} />
        <Route path="/create">
          <Route path="redirect" element={<RuleForm key={0} />} />
          <Route path="block" element={<RuleForm key={1} />} />
          <Route path="query-param" element={<RuleForm key={2} />} />
          <Route path="modify-header" element={<RuleForm key={3} />} />
          <Route path="modify-response" element={<RuleForm key={4} />} />
          <Route path="modify-request-body" element={<RuleForm key={5} />} />
          <Route path="inject-file" element={<RuleForm key={6} />} />
          <Route path="http-logger" element={<HTTPLogger clientName={WebRequestClients.MAIN} />} />
        </Route>
        <Route path="/edit">
          <Route path="redirect/:id" element={<RuleForm key={7} />} />
          <Route path="block/:id" element={<RuleForm key={8} />} />
          <Route path="query-param/:id" element={<RuleForm key={9} />} />
          <Route path="modify-header/:id" element={<RuleForm key={10} />} />
          <Route path="modify-response/:id" element={<RuleForm key={11} />} />
          <Route path="modify-request-body/:id" element={<RuleForm key={12} />} />
          <Route path="inject-file/:id" element={<RuleForm key={13} />} />
        </Route>
        <Route path="/template">
          <Route path="redirect" element={<RuleForm key={30} />} />
          <Route path="block" element={<RuleForm key={31} />} />
          <Route path="query-param" element={<RuleForm key={32} />} />
          <Route path="modify-header" element={<RuleForm key={33} />} />
          <Route path="modify-response" element={<RuleForm key={34} />} />
          <Route path="modify-request-body" element={<RuleForm key={35} />} />
          <Route path="inject-file" element={<RuleForm key={36} />} />
        </Route>
        <Route path="/record">
          <Route path="" element={<Record />} />
          <Route path="session" element={<SessionList />} />
          <Route path="shared/session/:id" element={<SessionDetails />} />
          <Route path="session/:id" element={<SessionDetails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
