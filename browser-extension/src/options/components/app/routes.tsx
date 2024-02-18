import RouteListener from "@options/components/routeListener/routeListener";
import HTTPLogger from "@options/pages/httpLogger/httpLogger";
import Record from "@options/pages/record/record";
import SessionList from "@options/pages/sessionList/sessionList";
import SessionDetails from "@/options/pages/sessionDetails/sessionDetails";
import Main from "@options/components/main/main";
import NotFound from "@options/components/notFound/notFound";
import Redirect from "@/options/pages/forms/redirect/redirect";
import Block from "@/options/pages/forms/block/block";
import QueryParam from "@/options/pages/forms/queryParam/queryParam";
import ModifyHeader from "@/options/pages/forms/modifyHeader/modifyHeader";
import ModifyResponse from "@/options/pages/forms/modifyResponse/modifyResponse";
import ModifyRequestBody from "@/options/pages/forms/modifyRequestBody/modifyRequestBody";
import InjectFile from "@/options/pages/forms/injectFile/injectFile";
import { Route, Routes } from "react-router-dom";
import { WebRequestClients } from "@models/WebRequestModel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RouteListener />}>
        <Route path="/" element={<Main />} />
        <Route path="/create">
          <Route path="redirect" element={<Redirect key={0} />} />
          <Route path="block" element={<Block key={1} />} />
          <Route path="query-param" element={<QueryParam key={2} />} />
          <Route path="modify-header" element={<ModifyHeader key={3} />} />
          <Route path="modify-response" element={<ModifyResponse key={4} />} />
          <Route path="modify-request-body" element={<ModifyRequestBody key={5} />} />
          <Route path="inject-file" element={<InjectFile key={6} />} />
          <Route path="http-logger" element={<HTTPLogger clientName={WebRequestClients.MAIN} />} />
        </Route>
        <Route path="/edit">
          <Route path="redirect/:id" element={<Redirect key={7} />} />
          <Route path="block/:id" element={<Block key={8} />} />
          <Route path="query-param/:id" element={<QueryParam key={9} />} />
          <Route path="modify-header/:id" element={<ModifyHeader key={10} />} />
          <Route path="modify-response/:id" element={<ModifyResponse key={11} />} />
          <Route path="inject-file/:id" element={<InjectFile key={12} />} />
          <Route path="modify-request-body/:id" element={<ModifyRequestBody key={13} />} />
        </Route>
        <Route path="/template">
          <Route path="redirect" element={<Redirect key={30} />} />
          <Route path="block" element={<Block key={31} />} />
          <Route path="query-param" element={<QueryParam key={32} />} />
          <Route path="modify-header" element={<ModifyHeader key={33} />} />
          <Route path="modify-response" element={<ModifyResponse key={34} />} />
          <Route path="modify-request-body" element={<InjectFile key={35} />} />
          <Route path="inject-file" element={<ModifyRequestBody key={36} />} />
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
