export const jsonParesString = (json) => {
  if (typeof json !== "string") return json;

  try {
    return JSON.parse(json);
  } catch (e) {}

  return json;
};
