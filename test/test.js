import EdgeTTSBrowser from "../index";

const tts = new EdgeTTSBrowser();

tts.tts.setVoiceParams({
  text: "hello there doggo",
});

tts.ttsToFile("dog");
