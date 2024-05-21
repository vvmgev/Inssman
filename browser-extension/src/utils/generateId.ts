export const generateId = (): number => parseInt(`${Date.now() % 1000000}${Math.floor(Math.random() * 9999)}`);
