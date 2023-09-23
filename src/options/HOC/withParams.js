import { useParams, useNavigate, useLocation } from 'react-router-dom';

const withParams = (Component) => function withParamsClousure(props) {
  return <Component {...props} location={useLocation()} params={useParams()} navigate={useNavigate()} />;
};

export default withParams;
