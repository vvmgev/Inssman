import React from 'react';

const BrowserSupport = () => {
  return <div className="py-5 px-5 text-lg rounded-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-slate-700 w-full">
    <div className="mb-5">Please Update Your Browser Version</div>
    <div className="text-sm text-gray-500">Seems your are using an old version. The extension utilizes the latest APIs.</div>
    <div className="text-sm text-gray-500">Please update your browser version to access all features.</div>
  </div>
};

export default BrowserSupport