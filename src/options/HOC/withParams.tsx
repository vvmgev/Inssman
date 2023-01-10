import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

const withParams = (Component: any) => props => <Component {...props} params={useParams()} navigate={useNavigate()} />;

export default withParams;