import TTS from "./TTS.js";
import { buildWebSocketURL } from "../utils/utils.js";
import constants from "../constants/constants.js";

export default class EdgeTTSBrowser {
  static fileTypes = constants.OUTPUT_FORMATS;

  static async getVoices() {
    try {
      const response = await fetch(constants.VOICE_LIST_URL, {
        headers: constants.VOICE_HEADERS,
      });

      const data = await response.json();

      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
  /**
   * @constructor
   * @param {TTS} tts
   */
  constructor(tts) {
    this.url = buildWebSocketURL();
    this.tts = new TTS(tts);
    this.file = new Uint8Array();
  }

  /**
   * @param {string} directory
   * @returns {Promise<HTMLAnchorElement|Error>} - file path to the element or an error string
   */
  ttsToFile(fileName = "") {
    return new Promise((resolve, reject) => {
      if (!this.tts.text) {
        return reject("there is no text input");
      }

      const socket = new WebSocket(this.url);
      socket.binaryType = "arraybuffer";

      socket.addEventListener("error", (e) => {
        socket.close();
        reject(e.toString());
      });

      socket.addEventListener("close", (e) => {
        if (this.file.length === 0) {
          return reject(new Error("the file buffer is empty"));
        }

        // Create and download file using browser APIs
        try {
          const blob = new Blob([this.file], {
            type: this.tts.fileType.mimeType || "audio/wav",
          });

          resolve(blob);
        } catch (err) {
          console.error("Error creating file:", err);
          reject(err.toString());
        }
      });

      socket.addEventListener("open", () => {
        socket.send(this.tts.generateCommand());
        socket.send(this.tts.generateSSML());
      });

      socket.addEventListener("message", (data) => {
        if (data.data instanceof ArrayBuffer) {
          const buffer = new Uint8Array(data.data);
          if (buffer.length >= 2) {
            const headerLength = (buffer[0] << 8) | (buffer[1] + "\r\n".length);
            const header = buffer.subarray(0, headerLength);
            const result = this.#parseMessageText(
              new TextDecoder().decode(header)
            );

            if (result.Path !== "audio") {
              return;
            }

            const payload = buffer.subarray(headerLength);

            // Concatenate audio data
            const newFile = new Uint8Array(this.file.length + payload.length);
            newFile.set(this.file);
            newFile.set(payload, this.file.length);
            this.file = newFile;
          } else {
            console.error(
              "Received data is too short to contain a valid header."
            );
          }
        } else if (typeof data.data === "string") {
          const result = this.#parseMessageText(data.data);
          if (result.Path === "turn.end") {
            socket.close();
          }
        }
      });
    });
  }
  /**
   * @param {string} text
   * @returns {object}
   */
  #parseMessageText(text) {
    const obj = {};
    const split = text.split("\r\n");

    split
      .filter((line) => line !== "")
      .map((line) => {
        try {
          obj.metaData = JSON.parse(line);
        } catch {
          const [key, value] = line.split(":");
          obj[key] = value;
        }
      });

    return obj;
  }
}
