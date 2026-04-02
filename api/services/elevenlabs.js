/**
 * ElevenLabs API Service
 * Handles text-to-speech generation using ElevenLabs
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.warn('WARNING: ELEVENLABS_API_KEY environment variable is not set. Voiceover will use fallback/mock.');
}

const BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * Generate voiceover from text
 */
export async function generateVoiceover(params) {
  const { 
    text, 
    voice_id = '21m00Tcm4TlvDq8ikWAM', // Default voice (Rachel)
    model_id = 'eleven_monolingual_v1',
    stability = 0.5,
    similarity_boost = 0.75,
    style = 0.0,
    use_speaker_boost = true
  } = params;

  if (!ELEVENLABS_API_KEY) {
    console.log('[ElevenLabs] No API key, returning mock response');
    return {
      data: {
        task_id: `mock_voice_${Date.now()}`,
        status: 'COMPLETED',
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      }
    };
  }

  const response = await fetch(`${BASE_URL}/text-to-speech/${voice_id}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id,
      voice_settings: {
        stability,
        similarity_boost,
        style,
        use_speaker_boost
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail?.message || `ElevenLabs request failed: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // The API returns the audio buffer directly
  const audioBuffer = await response.arrayBuffer();
  
  // In a real production app, we would upload this to S3/Firebase Storage
  // For this local/demo project, we'll assume there's a utility to handle this
  // Or we return the base64 or a local path.
  // For now, let's pretend we have an upload utility.
  
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

  return {
    data: {
      task_id: `voice_${Date.now()}`,
      status: 'COMPLETED',
      generated: [audioUrl],
      audio_url: audioUrl // Keep for backward compatibility
    }
  };
}

/**
 * Get available voices
 */
export async function getVoices() {
  if (!ELEVENLABS_API_KEY) return { voices: [] };

  const response = await fetch(`${BASE_URL}/voices`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch voices');
  return response.json();
}
