const BASE_URL =
  "speech.platform.bing.com/consumer/speech/synthesize/readaloud";
const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";

const WSS_URL = `wss://${BASE_URL}/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;
const VOICE_LIST_URL = `https://${BASE_URL}/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;

const CHROMIUM_FULL_VERSION = "130.0.2849.68";
const CHROMIUM_MAJOR_VERSION = CHROMIUM_FULL_VERSION.split(".")[0];
const SEC_MS_GEC_VERSION = `1-${CHROMIUM_FULL_VERSION}`;
const BASE_HEADERS = {
  "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
};
const WSS_HEADERS = {
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
  ...BASE_HEADERS,
};
const VOICE_HEADERS = {
  Authority: "speech.platform.bing.com",
  "Sec-CH-UA": `" Not;A Brand";v="99", "Microsoft Edge";v="${CHROMIUM_MAJOR_VERSION} "Chromium";v="${CHROMIUM_MAJOR_VERSION}"`,
  "Sec-CH-UA-Mobile": "?0",
  Accept: "*/*",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  ...BASE_HEADERS,
};

const WIN_EPOCH = 11644473600;

const constants = {
  TRUSTED_CLIENT_TOKEN: TRUSTED_CLIENT_TOKEN,
  WSS_URL: WSS_URL,
  VOICE_LIST_URL: VOICE_LIST_URL,
  CHROMIUM_FULL_VERSION: CHROMIUM_FULL_VERSION,
  CHROMIUM_MAJOR_VERSION: CHROMIUM_MAJOR_VERSION,
  SEC_MS_GEC_VERSION: SEC_MS_GEC_VERSION,
  WSS_HEADERS: WSS_HEADERS,
  VOICE_HEADERS: VOICE_HEADERS,
  WIN_EPOCH: WIN_EPOCH,
  OUTPUT_FORMATS: {
    AUDIO_24KHZ_48KBITRATE_MONO_MP3: {
      tag: "audio-24khz-48kbitrate-mono-mp3",
      ext: ".mp3",
    },
    AUDIO_24KHZ_96KBITRATE_MONO_MP3: {
      tag: "audio-24khz-96kbitrate-mono-mp3",
      ext: ".mp3",
    },
    WEBM_24KHZ_16BIT_MONO_OPUS: {
      tag: "webm-24khz-16bit-mono-opus",
      ext: ".webm",
    },
  },
};

export default Object.freeze(constants);
