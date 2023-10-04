export * from './regExp';
export * from './timeDifference';
export const encode = (mimi, value = '') => `data:${mimi};charset=UTF-8;base64,${btoa(unescape(encodeURIComponent(value)))}`;
export const decode = (value = '') => decodeURIComponent(escape(atob(value.substring(value.indexOf('base64,') + 7))));
export const structuredClone = (object: any) => (typeof window?.structuredClone === 'function' && window.structuredClone(object)) || JSON.parse(JSON.stringify(object));