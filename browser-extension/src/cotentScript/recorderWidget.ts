// @ts-nocheck

let isWidgetShown = false;

const sendData = () => {
  window.postMessage({action: "stopRecording", source: 'inssman:recorderWidget'}, window.origin);
}

class RecordSessionWidget extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this.getHTML();

    this.shadowRoot.querySelector('.inssman-rocerder-widget .stop-content')?.addEventListener('click', () => {
      window.postMessage({action: "stopRecording", source: 'inssman:recorderWidget'}, window.origin);
    })

    // div.addEventListener('click', () => {
    //   window.postMessage({action: "stopRecording", source: 'inssman:recorderWidget'}, window.origin);
    // });

  }


  getHTML() {
    return `
    <div class="inssman-rocerder-widget container">
      <div class="recording-content">
        <span class="record-icon"></span>
        <span>Recording</span>
      </div>
      <div class="stop-content">
        <span class="stop-icon"></span>
        <span>Stop</span>
      </div>
    </div>

    <style>
      .container {
        position: fixed;
        bottom: 100px;
        left: 30px;
        display: inline-flex;
        gap: 20px;
        background: rgba(15, 23, 42, 1);
        color: white;
        align-items: center;
        justify-content: center;
        padding: 10px 15px;
        border-radius: 20px;
      }
      .stop-content,
      .remove-content {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
      }
      .stop-content:hover,
      .remove-content:hover {
        cursor: pointer;
      }
      .recording-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .record-icon {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        background: red;
        animation: blink 1s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
        border-radius: 50%;
      }

      .stop-icon {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stop-icon::after {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        background: red;
      }

      @keyframes blink {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `
  }

}

customElements.define('inssman-record-session-widget', RecordSessionWidget);

window.addEventListener('message', event => {
  const { action, source, data } = event.data;
  if ((event.origin !== window.origin) || (!source?.startsWith?.('inssman:') || source.startsWith('inssman:recorderWidget'))) return;
  switch (action) {
    case 'showWidget':
      if(isWidgetShown) return;
      document.documentElement.appendChild(document.createElement('inssman-record-session-widget'));
      isWidgetShown = true;
    break;
  }
});
