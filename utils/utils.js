import constants from "../constants/constants.js";
import CryptoJS from "crypto-js";

/**
 * @returns {string}
 */
export function buildWebSocketURL() {
  let url = constants.WSS_URL;
  url += "&Sec-MS-GEC=";
  url += generateSecMsGec();
  url += "&Sec-MS-GEC-Version=";
  url += constants.SEC_MS_GEC_VERSION;
  url += "&ConnectionId=";
  url += uuid();
  return url;
}

/**
 * @returns {string}
 */
function generateSecMsGec() {
  const now = new Date();
  const unixTimestamp = Math.floor(now.getTime() / 1000);
  const S_TO_NS = 1e9;

  let ticks = unixTimestamp + constants.WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= S_TO_NS / 100;

  const strToHash = `${Math.floor(ticks)}${constants.TRUSTED_CLIENT_TOKEN}`;

  // Use CryptoJS for SHA-256 hashing (browser compatible)
  return CryptoJS.SHA256(strToHash).toString(CryptoJS.enc.Hex).toUpperCase();
}

/**
 * @returns {string} - uuid is used in headers
 */
export function uuid() {
  // Use browser's crypto.randomUUID() if available (modern browsers)
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID().replaceAll("-", "").toUpperCase();
  }

  // Fallback UUID generation for older browsers
  return generateCryptoJSUUID().replaceAll("-", "").toUpperCase();
}

/**
 * Fallback UUID generator for browsers without crypto.randomUUID()
 * @returns {string}
 */
function generateCryptoJSUUID() {
  // Generate 16 random bytes (128 bits) using CryptoJS
  const randomWords = CryptoJS.lib.WordArray.random(16);
  const randomBytes = [];

  // Convert WordArray to byte array
  for (let i = 0; i < randomWords.words.length; i++) {
    const word = randomWords.words[i];
    randomBytes.push((word >>> 24) & 0xff);
    randomBytes.push((word >>> 16) & 0xff);
    randomBytes.push((word >>> 8) & 0xff);
    randomBytes.push(word & 0xff);
  }

  // Set version (4) and variant bits according to RFC 4122
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 10

  // Convert to hex string and format as UUID
  const hex = randomBytes
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join("-");
}
