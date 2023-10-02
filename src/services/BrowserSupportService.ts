class BrowserSupport {
    isSupportRules = (): boolean => (
        Boolean(chrome?.declarativeNetRequest?.updateDynamicRules) &&  Boolean(chrome?.declarativeNetRequest?.getDynamicRules)
    );
    isSupportScripting = (): boolean => Boolean(chrome?.scripting?.executeScript);
}

export default new BrowserSupport();