export const structuredClone = (object: Record<string, unknown>) =>
  (typeof window?.structuredClone === "function" && window.structuredClone(object)) ||
  JSON.parse(JSON.stringify(object));
