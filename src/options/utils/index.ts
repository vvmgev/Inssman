export * from './regExp';
export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
export const encode = (mimi, value = '') => `data:${mimi};charset=UTF-8;base64,${btoa(unescape(encodeURIComponent(value)))}`;
export const decode = (value = '') => decodeURIComponent(escape(atob(value.substring(value.indexOf('base64,') + 7))));