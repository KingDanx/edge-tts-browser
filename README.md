# Edge TTS Browser

A client-side JavaScript/TypeScript library for leveraging Microsoft Edge's Text-to-Speech (TTS) service directly in the browser. This project enables developers to integrate high-quality, natural-sounding speech synthesis into web applications without requiring Microsoft Edge, Windows, or an API key.

## Features

- **Text-to-Speech Synthesis**: Convert text to natural-sounding audio using Microsoft Edge's TTS capabilities.
- **Browser Compatibility**: Works in modern browsers (Chrome, Firefox, Edge, etc.) with no server-side dependencies.
- **Multiple Voice Options**: Choose from a variety of voices, supporting multiple languages and genders.
- **Customizable Audio**: Adjust speech rate, volume, and pitch to suit your needs.
- **Streaming Support**: Stream audio in real-time for efficient playback.
- **Lightweight and Easy to Integrate**: Modular design for seamless inclusion in web projects.
- **No API Key Required**: Utilizes Microsoft Edge's Read Aloud API for free TTS functionality.

## Installation

### Via npm
1. Install the package in your project:
   ```bash
   npm install @kingdanx/edge-tts-browser
   ```

## Usage

### Basic Example
Synthesize text to speech and play it in the browser:

```javascript
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

```

### Listing Available Voices
Retrieve and filter available voices by language or gender:



## Configuration Options

- **voice**: Specify the voice (e.g., `en-US-AriaNeural`, `es-ES-ElviraNeural`). Use `getVoices()` to list all available voices.
- **rate**: Adjust speech speed (range: 0.5 to 2.0, default: 1.0).
- **volume**: Set volume level (range: 0 to 100, default: 100).
- **pitch**: Modify pitch (e.g., `low`, `medium`, `high`, or specific Hz values like `+0Hz`).
- **outputFormat**: Choose audio format (e.g., `audio-24khz-48kbitrate-mono-mp3`, `audio-16khz-32kbitrate-mono-mp3`).

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari).
- Internet connection to access Microsoft Edge's TTS service.
- Optional: Node.js and npm for development or local testing.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/KingDanx/edge-tts-browser.git
   cd edge-tts-browser
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Install frontend dependencies:
   ```bash
   cd html && npm install
   ```

4. Start the dev server for testing sample code
    ```bash
    bun run html
    ```

3. Build the project:
   ```bash
   bun run build
   ```

## Limitations

- **Internet Dependency**: Requires an active internet connection to communicate with Microsoft's TTS service.
- **Rate Limits**: Microsoft may impose rate limits to prevent abuse. Avoid excessive requests in production environments.
- **SSML Restrictions**: Custom SSML is not supported due to Microsoft Edge API limitations, which only allow basic `<voice>` and `<prosody>` tags.[](https://github.com/rany2/edge-tts)

## Acknowledgments

- Inspired by the [edge-tts](https://github.com/rany2/edge-tts) Python library by rany2.[](https://github.com/rany2/edge-tts)
- Built using Microsoft Edge's Read Aloud API for high-quality TTS.


This project uses Microsoft Edge's online TTS service. While it is free for personal use, Microsoft may enforce rate limits or restrictions for excessive or commercial use. For production-grade or commercial applications, consider using [Azure AI Speech](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/) to ensure compliance with Microsoft's terms of service.[](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)