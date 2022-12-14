import React from 'react';
import { useLocation } from 'react-router-dom';


const Header =  () => {
    let location = useLocation();
    return <div className="h-16 bg-white m-5 w-[calc(100%-m-5)] rounded-lg">
        <h1>Header</h1>
    </div>
}
export default Header;