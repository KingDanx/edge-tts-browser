import "./style.css";
import { uuid } from "../../utils/utils";

import EdgeTTSBrowser from "../../models/EdgeTTSBrowser";

const tts = new EdgeTTSBrowser();

let currentFile = null;

const selectEl = document.querySelector("#voice-select");
const generateBtn = document.querySelector("#generate-btn");
const downloadBtn = document.querySelector("#download-btn");
const audioEl = document.querySelector("#tts-audio");
let anchorEl = document.querySelector("#anchor");

const voices = await EdgeTTSBrowser.getVoices();

if (voices) {
  for (const v of voices) {
    const option = document.createElement("option");
    option.value = v.ShortName;
    option.innerText = v.FriendlyName;
    selectEl.append(option);
  }
}

generateBtn.addEventListener("click", async () => {
  try {
    downloadBtn.disabled = true;
    generateBtn.disabled = true;
    if (anchorEl.href !== "") {
      console.log("revoked");
      URL.revokeObjectURL(anchorEl.href);
      URL.revokeObjectURL(audioEl.src);
    }
    const text = document.querySelector("#user-text").value;
    tts.tts.setVoiceParams({
      text,
      voice: selectEl?.value || tts.tts.voice,
    });

    const fileName = `output-${uuid()}${tts.tts.fileType.ext}`;

    const blob = await tts.ttsToFile(fileName);

    const url = URL.createObjectURL(blob);

    anchorEl.href = url;
    anchorEl.download = fileName;

    audioEl.src = url;
  } catch (e) {
    currentFile = null;
    console.error(e);
  } finally {
    downloadBtn.disabled = false;
    generateBtn.disabled = false;
  }
});

downloadBtn.addEventListener("click", () => {
  try {
      anchorEl.click();
  } catch (e) {
    console.error(e);
  }
});
