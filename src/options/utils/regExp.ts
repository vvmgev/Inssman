export const protocolRegExp: RegExp = /^http(s?):\/\//
export const makeExactMatch: Function = (url: string): string => {
    if(!url.match(protocolRegExp)) {
        return `^http(s?)://${url}\/?$`;
    }
    return `^${url}\/?$`;
}

export const addProtocol: Function = (url: string): string => {
    if(!url.match(protocolRegExp)) {
        return `^http(s?)://${url}\/?$`;
    }
    return url;
} 

export const escapedSymbols: {[key: string]: string} = {
    '/': '\\/',
    '\\?': '\\?',
    '\\*' : '(.*)'
}

export const escapSymbols: Function = (defaultValue: string = ''): string => {
    // need to replace with another implmentation   
    return Object.entries(escapedSymbols).reduce((prev, current) => {
        const regExp: RegExp = new RegExp(current[0], 'g');
        return prev.replace(regExp, current[1]);
    }, defaultValue)
}

//  '^http(s)?:\/\/fb.com\/test(\/?)\\?a=12&b=2$'

// . https://www.facebook.com/test?a=12&b=2