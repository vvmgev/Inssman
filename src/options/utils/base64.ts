export const encode = (mimi, value = '') => `data:${mimi};charset=UTF-8;base64,${btoa(value)}`;
