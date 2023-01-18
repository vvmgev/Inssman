import React from 'react';

const BrowserSupport = ({children}) => {
  chrome.declarativeNetRequest.updateDynamicRules

  if(!chrome.declarativeNetRequest.updateDynamicRules || !chrome.declarativeNetRequest.getDynamicRules) {
    return <div className="py-5 px-5 text-lg rounded-3xl bg-slate-800 bg-opacity-40 drop-shadow-xl shadow-inner border-r border-t border-slate-700 w-full">
      <div>Please Update Your Browser Version</div>
      <div className="text-sm text-gray-500">Seems your are using an old version</div>
    </div>
  }

  return children;
};

export default BrowserSupport