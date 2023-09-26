class BrowserSupport {
  isSupportRules = () => (
    Boolean(chrome?.declarativeNetRequest?.updateDynamicRules) && Boolean(chrome?.declarativeNetRequest?.getDynamicRules)
  );

  isSupportScripting = () => Boolean(chrome?.scripting?.executeScript);
}

export default new BrowserSupport();
