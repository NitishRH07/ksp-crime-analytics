const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: '*' }));

app.post('/api/voice/transcribe', (req, res) => {
  try {
    const { audio_base64, language } = req.body;
    
    // In a real implementation this would call Catalyst Zia Speech-to-Text API
    // For demo purposes when browser STT fails:
    const mockTranscripts = {
      'en': 'Show me the recent robbery cases in Koramangala.',
      'kn': 'Koramangala dalli aada itteechegina kalavu prakaranagalannu thorisi.'
    };
    
    res.status(200).json({ 
      success: true, 
      transcript: mockTranscripts[language] || mockTranscripts['en'] 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to transcribe audio' });
  }
});

app.post('/api/voice/speak', (req, res) => {
  try {
    const { text, language } = req.body;
    
    // In a real implementation this would call Catalyst Zia Text-to-Speech API
    // and return a base64 audio string.
    // For the demo we rely on browser-native SpeechSynthesis API on the frontend,
    // so this is a fallback that just returns success.
    
    res.status(200).json({ 
      success: true, 
      audio_url: null, // Frontend will fallback to browser TTS if null
      message: 'Use browser TTS'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to synthesize speech' });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = app;
