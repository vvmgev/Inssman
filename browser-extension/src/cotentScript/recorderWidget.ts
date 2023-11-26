// @ts-nocheck

let isWidgetShown = false;

window.addEventListener('message', event => {
  const { action, source, data } = event.data;
  if ((event.origin !== window.origin) || (!source?.startsWith?.('inssman:') || source.startsWith('inssman:recorderWidget'))) return;
  switch (event.data.action) {
    case 'showWidget':
      if(isWidgetShown) return;
      document.documentElement.appendChild(createWidget());
      isWidgetShown = true;
    break;
  }
});

const createWidget = () => {
  const button = document.createElement('button');
  button.textContent = 'Button';
  button.style.cssText = `
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  `;
  button.addEventListener('click', () => {
    window.postMessage({action: "stopRecording", source: 'inssman:recorderWidget'}, window.origin);
  });

  return button;
}
