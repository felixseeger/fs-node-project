import React, { useState, useRef, useEffect, useCallback } from 'react';
import { processVoiceInput } from '../utils/api';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  placeholder?: string;
  autoStopMs?: number; // Auto-stop after N ms of silence
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  onRecordingStateChange,
  placeholder = "Press and hold to speak...",
  autoStopMs = 2000
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    mediaRecorderRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    
    // Check if browser supports mediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Audio recording not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Setup Visualizer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Ensure mimeType is supported by the browser
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4'; // Fallback for Safari/iOS
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ''; // Let browser choose default
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType ? mimeType : undefined
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        // Only transcribe if we have actual audio data (prevent empty transcibes)
        if (audioBlob.size > 100) { 
          handleTranscription(audioBlob);
        } else {
          setError('Recording too short or no audio detected');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data in chunks for better memory management
      setIsRecording(true);
      onRecordingStateChange?.(true);

      // Start visualization and silence detection
      visualize();
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Microphone is already in use');
      } else {
        setError('Microphone error: ' + err.message);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange?.(false);
      cleanup();
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const update = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedVolume = Math.min(1, average / 128);
      setVolume(normalizedVolume);

      // Hardening: Silence detection (VAD light)
      if (normalizedVolume > 0.05) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (!silenceTimerRef.current && autoStopMs > 0) {
        silenceTimerRef.current = setTimeout(() => {
          console.log('[VoiceRecorder] Silence detected, stopping...');
          stopRecording();
        }, autoStopMs);
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };
    
    update();
  };

  const handleTranscription = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const result = await processVoiceInput(blob);
      if (result.success && result.text) {
        onTranscription(result.text);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-recorder-container" style={{ position: 'relative', width: '100%' }}>
      <button
        className={`nodrag nopan voice-recorder-btn ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={isRecording ? stopRecording : undefined}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isProcessing}
        style={{
          width: '100%',
          height: '40px',
          background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isRecording ? '#ef4444' : error ? '#ef4444' : '#3a3a3a'}`,
          borderRadius: '8px',
          color: isRecording ? '#ef4444' : isProcessing ? '#999' : '#e0e0e0',
          cursor: isProcessing ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '13px',
          transition: 'all 0.2s ease',
          outline: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {isProcessing ? (
          <>
            <span className="spinner" style={{ 
              width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', 
              borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' 
            }} />
            Transcribing...
          </>
        ) : isRecording ? (
          <>
            <div style={{ 
              width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
              animation: 'pulse 1s infinite'
            }} />
            Recording...
            <div style={{ 
              flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px', overflow: 'hidden', marginLeft: '8px' 
            }}>
              <div style={{ 
                height: '100%', width: `${volume * 100}%`, background: '#ef4444',
                transition: 'width 0.1s ease'
              }} />
            </div>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <span style={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              maxWidth: '80%'
            }}>
              {error ? `Error: ${error}` : placeholder}
            </span>
          </>
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 
          0% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.5; transform: scale(1.1); } 
          100% { opacity: 1; transform: scale(1); } 
        }
      `}} />
    </div>
  );
};

export default VoiceRecorder;
