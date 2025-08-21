import { uuid } from "../utils/utils.js";
import constants from "../constants/constants.js";

export default class TTS {
  static defaults = {
    voice: "en-US-GuyNeural",
    pitch: "+0Hz",
    rate: "+0%",
    volume: "+0%",
    text: null,
    fileType: constants.OUTPUT_FORMATS.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  };

  constructor(
    {
      voice=TTS.defaults.voice,
      pitch=TTS.defaults.pitch,
      rate=TTS.defaults.rate,
      volume=TTS.defaults.volume,
      text,
      fileType = TTS.defaults.fileType,
    } = TTS.defaults
  ) {
    this.voice = voice;
    this.pitch = pitch;
    this.rate = rate;
    this.volume = volume;
    this.text = text;
    this.fileType = fileType;
  }

  /**
   * @returns {string}
   */
  generateSSML() {
    let ssml = "";

    ssml += "X-RequestId:";
    ssml += uuid();
    ssml += "\r\nContent-Type:application/ssml+xml";
    ssml += `\r\nX-Timestamp:${new Date()}Z`;
    ssml += "\r\nPath:ssml";
    ssml +=
      "\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>";
    ssml += `\r\n\t<voice name='${this.voice}'>`;
    ssml += `\r\n\t\t<prosody pitch='${this.pitch}' rate='${this.rate}' volume='${this.volume}'>`;
    ssml += `\r\n\t\t\t${this.text}`;
    ssml += "\r\n\t\t</prosody>";
    ssml += "\r\n\t</voice>";
    ssml += "\r\n</speak>";
    return ssml;
  }

  /**
   * @returns {string}
   */
  generateCommand() {
    let command = "";
    command += `X-Timestamp:${new Date()}`;
    command += "\r\nContent-Type:application/json; charset=utf-8";
    command += "\r\nPath:speech.config";
    command += `\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":true},"outputFormat":"${this.fileType.tag}"}}}}\r\n`;
    return command;
  }

  /**
   *
   * @param {Object} voiceParams
   * @param {string} [voiceParams.voice] - EdgeTTS.getVoices() -> voice.ShortName
   * @param {string} [voiceParams.pitch] - +0Hz, -10Hz, +50Hz
   * @param {string} [voiceParams.rate] - +0%, -10%, +50%
   * @param {string} [voiceParams.volume] - +0%, -10%, +50%
   * @param {string} [voiceParams.text] - This will be the audio output
   * @param {Object} [voiceParams.fileType] - EdgeTTS.fileTypes
   * @param {string} voiceParams.fileType.tag
   * @param {string} voiceParams.fileType.ext
   * @returns {void}
   */
  setVoiceParams({
    voice = this.voice,
    pitch = this.pitch,
    rate = this.rate,
    volume = this.volume,
    text = this.text,
    fileType = this.fileType,
  }) {
    this.voice = voice;
    this.pitch = pitch;
    this.rate = rate;
    this.volume = volume;
    this.text = text;
    this.fileType = fileType;
  }
}
