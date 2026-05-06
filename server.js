import express from 'express';
import textToSpeech from '@google-cloud/text-to-speech';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(join(__dirname, 'public')));

// One TTS client, reused. Picks up Application Default Credentials
// from `gcloud auth application-default login`.
const client = new textToSpeech.TextToSpeechClient();

app.post('/synthesize', async (req, res) => {
  try {
    const { text, voice, languageCode, speakingRate, useSSML } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // The input field switches between { text } and { ssml }.
    // SSML must be wrapped in <speak>...</speak> tags.
    const input = useSSML ? { ssml: text } : { text };

    const [response] = await client.synthesizeSpeech({
      input,
      voice: {
        languageCode: languageCode || 'en-US',
        name: voice || 'en-US-Chirp3-HD-Leda',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: speakingRate || 1.0,
      },
    });

    // response.audioContent is a Buffer of MP3 bytes.
    // Send it back as base64 JSON so the browser can drop it into <audio>
    // via a data URL — simplest possible path.
    res.json({
      audioBase64: response.audioContent.toString('base64'),
      mimeType: 'audio/mpeg',
      sizeBytes: response.audioContent.length,
    });
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({
      error: err.message || 'Synthesis failed',
      // Surface Google's error details to help debug SSML mistakes etc.
      details: err.details || null,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TTS playground running at http://localhost:${PORT}`);
});
