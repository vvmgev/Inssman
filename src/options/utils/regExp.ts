export const backslashNumber = /\\[0-9]/;
export const replaceAsterisk = (str: string) => str.replace(/[*]/g, '(.*)');
export const replaceVariable = (str: string) => str.replace(/\$(\d+)/g, "\\$1");
export const escapeRegex = (str: string) => str.replace(/([.*+^=!:${}()|\[\]\/\\])/g, "\\$1");
export const protocolRegExp = /^http(s?):\/\//;
export const replaceAsteriskToPlus = (str) => str.replaceAll('*', '(.+)');
export const escapSymbols = (rule: string) => "^" + rule.split("*").map(escapeRegex).join("(.*)") + "$";

export const makeExactMatch: Function = (url: string): string => {
    if(!url.match(protocolRegExp)) {
        // return `^http(s)?\\:\\/\\/${escapeRegex(url)}\\/?$`; // version 1
        // return `^http(s)?://${escapeRegex(url)}/?$`; version 2
        return `^http(s)?://${url}/?$`;
    }
    return `^${url}/?$`;
    // return `^${url}\\/?$`; with version 1
}

export const addProtocolRegExp: Function = (url: string): string => {
    if(!url.match(protocolRegExp)) {
        return `^http(s?)://${url}\/?$`;
    }
    return url;
}

export const addProtocol: Function = (url: string): string => {
    if(!url.match(protocolRegExp)) {
        return `http://${url}`;
    }
    return url;
}

export const escapedSymbols: {[key: string]: string} = {
    '/': '\\/',
    '\\?': '\\?',
    '\\*' : '(.*)'
}

// export const escapSymbols: Function = (defaultValue: string = ''): string => {
//     // need to replace with another implmentation   
//     return Object.entries(escapedSymbols).reduce((prev, current) => {
//         const regExp: RegExp = new RegExp(current[0], 'g');
//         return prev.replace(regExp, current[1]);
//     }, defaultValue)
// }



//  '^http(s)?:\/\/fb.com\/test(\/?)\\?a=12&b=2$'

// . https://www.facebook.com/test?a=12&b=2