window.addEventListener('message', event => {
  const { action, source, data } = event.data;
  if ((event.origin !== window.origin) || (!source?.startsWith?.('inssman:') || source.startsWith('inssman:setup'))) return;

  if(action === 'runtimeId') {
    //@ts-ignore
    event.source.postMessage({
      source: 'inssman:setup',
      action: 'runtimeId',
      data: {runtimeId: chrome.runtime.id}
    });
  }

  if(action === 'generateUrl') {
    //@ts-ignore
    event.source.postMessage({
      source: 'inssman:setup',
      action: 'generateUrl',
      data: {
        url: chrome.runtime.getURL(data.filePath)
      }
    });
  }
});
