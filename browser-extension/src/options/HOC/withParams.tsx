import { useParams, useNavigate, useLocation } from "react-router-dom";

const withParams = (Component: any) => (props) =>
  <Component {...props} location={useLocation()} params={useParams()} navigate={useNavigate()} />;

export default withParams;
