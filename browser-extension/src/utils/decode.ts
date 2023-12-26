export const decode = (value = "") =>
  decodeURIComponent(
    escape(atob(value.substring(value.indexOf("base64,") + 7)))
);
