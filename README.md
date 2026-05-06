# Google Cloud TTS Playground

A tiny Node.js + browser playground for testing Google Cloud Text-to-Speech with SSML.

## Setup

### 1. Enable Google Cloud TTS API

```bash
gcloud services enable texttospeech.googleapis.com
```

### 2. Get credentials

The easiest way for local dev — Application Default Credentials:

```bash
gcloud auth application-default login
```

This will open a browser, you log in, and it caches creds locally. The Node SDK picks them up automatically. No service account JSON files to wrangle.

### 3. Install + run

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## What you can do

- Type plain text or SSML into the textarea
- Pick a voice (a few Chirp 3: HD voices preselected)
- Adjust speaking rate
- Click Synthesize — get an MP3 back, plays inline
- Download the MP3 if you want to keep it

## Why MP3?

For browser playback, MP3 plays natively everywhere via `<audio>`. OGG_OPUS is smaller but Safari is historically picky. Stick with MP3 for testing.

## SSML quick reference

Wrap everything in `<speak>...</speak>`. Inside:

- `<break time="500ms"/>` — pause
- `<emphasis level="strong">word</emphasis>` — stress a word
- `<say-as interpret-as="characters">SSML</say-as>` — spell it out
- `<say-as interpret-as="time">3:30pm</say-as>` — read as a time
- `<say-as interpret-as="date">2026-05-05</say-as>` — read as a date
- `<sub alias="World Wide Web">WWW</sub>` — substitute pronunciation
- `<phoneme alphabet="ipa" ph="təˈmeɪtoʊ">tomato</phoneme>` — IPA pronunciation

Note: With Chirp 3: HD, SSML works in synchronous mode (which this playground uses). Streaming mode does not support SSML.
