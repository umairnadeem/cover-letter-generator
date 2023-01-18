export function sanitizeString(str) {
  return str.replace(/[^a-zA-Z]/gi, "");
}