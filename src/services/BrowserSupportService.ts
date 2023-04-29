class BrowserSupport {
    isSupportRules = (): boolean => (
        Boolean(chrome?.declarativeNetRequest?.updateDynamicRules) &&  Boolean(chrome?.declarativeNetRequest?.getDynamicRules)
    );
    isSupportScriptting = (): boolean => Boolean(chrome?.scripting?.executeScript);
}

export default new BrowserSupport();