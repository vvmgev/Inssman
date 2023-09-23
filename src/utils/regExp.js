export const replaceAsterisk = (str) => str.replace(/[*]/g, '(.*)');
export const replaceVariable = (str) => str.replace(/\$(\d+)/g, '\\$1');
export const escapeRegex = (str) => str.replace(/([.*+^=!:${}()|\[\]\/\\])/g, '\\$1');
export const protocolRegExp = /^http(s?):\/\//;
export const replaceAsteriskToPlus = (str) => str.replaceAll('*', '(.+)');
export const escapSymbols = (rule) => `^${rule.split('*').map(escapeRegex).join('(.*)')}$`;

export const makeExactMatch = (url) => `^${url}/?$`;
// if(!url.match(protocolRegExp)) {
// return `^http(s)?\\:\\/\\/${escapeRegex(url)}\\/?$`; // version 1
// return `^http(s)?://${escapeRegex(url)}/?$`; version 2
// return `^http(s)?://${url}/?$`;
// }
// return `^${url}\\/?$`; with version 1

export const addProtocolRegExp = (url) => {
  if (!url.match(protocolRegExp)) {
    return `^http(s?)://${url}\/?$`;
  }
  return url;
};

export const addProtocol = (url) => {
  if (!url.match(protocolRegExp)) {
    return `http://${url}`;
  }
  return url;
};

export const escapedSymbols = {
  '/': '\\/',
  '\\?': '\\?',
  '\\*': '(.*)',
};

// export const escapSymbols: Function = (defaultValue: string = ''): string => {
//     // need to replace with another implmentation
//     return Object.entries(escapedSymbols).reduce((prev, current) => {
//         const regExp: RegExp = new RegExp(current[0], 'g');
//         return prev.replace(regExp, current[1]);
//     }, defaultValue)
// }

//  '^http(s)?:\/\/fb.com\/test(\/?)\\?a=12&b=2$'

// . https://www.facebook.com/test?a=12&b=2
