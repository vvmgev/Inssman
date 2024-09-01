const injectScript = (src: string) => {
  console.log("gev", window.location.href);
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.className = "inssman_script";

  (document.head || document.documentElement).appendChild(script);
  return script;
};

window.addEventListener("message", (event) => {
  const { action, source, data } = event.data;
  if (event.origin !== window.origin || !source?.startsWith?.("inssman:") || source.startsWith("inssman:setup")) return;

  if (action === "runtimeId") {
    //@ts-ignore
    event.source.postMessage({
      source: "inssman:setup",
      action: "runtimeId",
      data: { runtimeId: chrome.runtime.id },
    });
  }

  if (action === "generateUrl") {
    //@ts-ignore
    event.source.postMessage({
      source: "inssman:setup",
      action: "generateUrl",
      data: {
        url: chrome.runtime.getURL(data.filePath),
      },
    });
  }
});
