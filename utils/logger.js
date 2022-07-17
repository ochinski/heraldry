const checkMark = "\x1b[92m" + "✓" + "\x1b[0m";
export const pre = "[" + "\x1b[96m" + "Heraldry" + "\x1b[0m" + "] " + "\x1b[0m";
export const info = (message, check = false) =>
  check ? console.log(pre + message + checkMark) : console.log(pre + message);
export const error = (message) => info(message, "\x1b[31m");
