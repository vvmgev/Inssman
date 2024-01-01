// @ts-nocheck

let isWidgetShown = false;

class RecordSessionWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = this.getHTML();
    this.shadowRoot.querySelector(".inssman-recorder-widget .stop-content")?.addEventListener("click", () => {
      this.shadowRoot.querySelector(".inssman-recorder-widget").classList.add("hide");
      window.postMessage({ action: "stopRecording", source: "inssman:recorderWidget" }, window.origin);
    });
  }

  getHTML() {
    return `
    <div class="container inssman-recorder-widget">
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
        bottom: 20px;
        left: 20px;
        display: inline-flex;
        color: white;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 1);
        border-radius: 20px;
        padding: 3px;
        z-index: 999999999;
      }
      .stop-content {
        background: #FF0000;
      }
      .stop-content:hover {
        background: #b31900;
      }
      .stop-content,
      .recording-content {
        border-radius: 20px;
        padding: 10px 15px;
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
      }
      .stop-content:hover {
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
        background: white;
      }

      .hide {
        display: none;
      }

      @keyframes blink {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `;
  }
}

customElements.define("inssman-record-session-widget", RecordSessionWidget);

window.addEventListener("message", (event) => {
  const { action, source, data } = event.data;
  if (
    event.origin !== window.origin ||
    !source?.startsWith?.("inssman:") ||
    source.startsWith("inssman:recorderWidget")
  )
    return;
  switch (action) {
    case "showWidget":
      if (isWidgetShown) return;
      const widget = document.createElement("inssman-record-session-widget");
      widget.classList.add("inssman-ignore-element");
      document.documentElement.appendChild(widget);
      isWidgetShown = true;
      break;
  }
});
