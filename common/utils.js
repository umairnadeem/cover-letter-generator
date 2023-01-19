export function sanitizeString(str) {
  return str.replace(/[^\sa-zA-Z]/gi, "");
}
