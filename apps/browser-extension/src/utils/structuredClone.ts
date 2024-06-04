export const structuredClone = (object: any) =>
  (typeof globalThis?.structuredClone === "function" && globalThis.structuredClone(object)) ||
  JSON.parse(JSON.stringify(object));
