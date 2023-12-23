export const structuredClone = (object: any) =>
  (typeof window?.structuredClone === "function" &&
    window.structuredClone(object)) ||
  JSON.parse(JSON.stringify(object));
