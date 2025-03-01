'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NeuralVideoContainer } from '@/components/ui/neural-controls';
import { NeuralSettingsPanel } from '@/components/ui/neural-controls';
import { NeuralInput, NeuralTextarea, NeuralSelect } from '@/components/ui/neural-input';
import { NeuralSwitch } from '@/components/ui/neural-switch';
import { NeuralLoading, NeuralLoadingOverlay } from '@/components/ui/neural-loading';
import { NeuralMediaControls } from '@/components/ui/neural-media-controls';
import { ThemeToggle } from '@/components/theme-toggle';
import { base64ToFloat32Array, float32ToPcm16 } from '@/lib/utils';

interface Config {
  systemPrompt: string;
  voice: string;
}

// Update type definitions
interface AudioProcessingEvent extends Event {
  inputBuffer: {
    getChannelData(channel: number): Float32Array;
  };
}

export default function GeminiPlayground() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [config, setConfig] = useState<Config>({
    systemPrompt: "You are a friendly Gemini 2.0 model. Respond verbally in a casual, helpful tone.",
    voice: "Puck"
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInputRef = useRef<{
    source: MediaStreamAudioSourceNode;
    processor: ScriptProcessorNode;
    stream: MediaStream;
  } | null>(null);
  const clientId = useRef(crypto.randomUUID());
  const [videoEnabled, setVideoEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [chatMode, setChatMode] = useState<'audio' | 'video' | null>(null);
  const [videoSource, setVideoSource] = useState<'camera' | null>(null);

  // Add error handling constants
  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 2000; // 2 seconds
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const voiceOptions = [
    { value: 'Puck', label: 'Puck' },
    { value: 'Charon', label: 'Charon' },
    { value: 'Kore', label: 'Kore' },
    { value: 'Fenrir', label: 'Fenrir' },
    { value: 'Aoede', label: 'Aoede' },
  ];

  const audioBuffer: Float32Array[] = [];
  let isPlaying = false;

  const startStream = async (mode: 'audio' | 'camera') => {
    if (mode !== 'audio') {
      setChatMode('video');
    } else {
      setChatMode('audio');
    }

    const connectWebSocket = async () => {
      try {
        wsRef.current = new WebSocket(`ws://localhost:8000/ws/${clientId.current}`);
        
        wsRef.current.onopen = async () => {
          if (wsRef.current) {
            wsRef.current.send(JSON.stringify({
              type: 'config',
              config: config
            }));
          }
          
          await startAudioStream();

          if (mode !== 'audio') {
            setVideoEnabled(true);
            setVideoSource('camera');
          }

          setIsStreaming(true);
          setIsConnected(true);
          setReconnectAttempts(0);
        };

        wsRef.current.onmessage = async (event: MessageEvent) => {
          const response = JSON.parse(event.data);
          if (response.type === 'audio') {
            const audioData = base64ToFloat32Array(response.data);
            await playAudioData(audioData);
          } else if (response.type === 'text') {
            setText(prev => prev + response.data + '\n');
          }
        };

        wsRef.current.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('Quota exceeded')) {
            setError('API quota exceeded. Please try again in a few moments.');
          } else {
            setError('WebSocket error occurred: ' + errorMessage);
          }
          handleDisconnect();
        };

        wsRef.current.onclose = (event) => {
          console.log('WebSocket closed:', event);
          if (event.code === 1011 && event.reason.includes('Quota exceeded')) {
            handleDisconnect();
          } else {
            setIsStreaming(false);
            setIsConnected(false);
          }
        };
      } catch (err) {
        console.error('Connection error:', err);
        handleDisconnect();
      }
    };

    const handleDisconnect = () => {
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setError(`Connection lost. Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, RECONNECT_DELAY);
      } else {
        setError('Could not establish connection. Please try again later.');
        stopStream();
      }
    };

    await connectWebSocket();
  };

  const startAudioStream = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const processor = audioContextRef.current.createScriptProcessor(512, 1, 1);
        
        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = float32ToPcm16(Array.from(inputData));
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
            wsRef.current.send(JSON.stringify({
              type: 'audio',
              data: base64Data
            }));
          }
        };

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);
        
        audioInputRef.current = { source, processor, stream };
        setIsStreaming(true);
      }
    } catch (err) {
      const error = err as Error;
      setError('Failed to access microphone: ' + error.message);
    }
  };

  const stopStream = () => {
    setReconnectAttempts(0);
    if (audioInputRef.current) {
      const { source, processor, stream } = audioInputRef.current;
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach(track => track.stop());
      audioInputRef.current = null;
    }

    if (chatMode === 'video') {
      setVideoEnabled(false);
      setVideoSource(null);

      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
      }
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
        videoIntervalRef.current = null;
      }
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsStreaming(false);
    setIsConnected(false);
    setChatMode(null);
  };

  const playAudioData = async (audioData: Float32Array) => {
    if (audioBuffer) {
      audioBuffer.push(audioData);
      if (!isPlaying) {
        await playNextInQueue();
      }
    }
  };

  const playNextInQueue = async () => {
    if (!audioContextRef.current || !audioBuffer || audioBuffer.length === 0) {
      isPlaying = false;
      return;
    }

    isPlaying = true;
    const audioData = audioBuffer.shift();
    
    if (audioData && audioContextRef.current) {
      const buffer = audioContextRef.current.createBuffer(1, audioData.length, 24000);
      buffer.copyToChannel(audioData, 0);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        playNextInQueue();
      };
      source.start();
    }
  };

  // Frame capture function
  const captureAndSendFrame = () => {
    if (!canvasRef.current || !videoRef.current || !wsRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    wsRef.current.send(JSON.stringify({
      type: 'image',
      data: base64Image
    }));
  };

  useEffect(() => {
    if (videoEnabled && videoRef.current) {
      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 320 }, height: { ideal: 240 } }
          });
          
          if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoStreamRef.current = stream;
            
            // Start frame capture after video is playing
            videoIntervalRef.current = setInterval(() => {
              captureAndSendFrame();
            }, 1000);
          }
        } catch (err) {
          const error = err as Error;
          console.error('Video initialization error:', error);
          setError('Failed to access camera: ' + error.message);
          setVideoEnabled(false);
          setVideoSource(null);
        }
      };

      startVideo();

      // Cleanup function
      return () => {
        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
          videoStreamRef.current = null;
        }
        if (videoIntervalRef.current) {
          clearInterval(videoIntervalRef.current);
          videoIntervalRef.current = null;
        }
      };
    }
  }, [videoEnabled, videoSource]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Theme Toggle */}
        <div className="relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-neural-gradient bg-clip-text text-transparent">
              Gemini Multimodal Playground
            </h1>
            <p className="text-muted-foreground">
              Experience real-time conversations with Gemini 2.0 through voice, video, and screen sharing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video/Screen Container */}
          <div className="lg:col-span-2">
            <div className="relative">
              <NeuralVideoContainer>
                {!isConnected ? (
                  <NeuralLoadingOverlay>
                    Initializing connection...
                  </NeuralLoadingOverlay>
                ) : (
                  <>
                    {videoEnabled ? (
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          width={320}
                          height={240}
                          className="w-full h-full object-contain"
                          style={{ transform: videoSource === 'camera' ? 'scaleX(-1)' : 'none' }}
                        />
                        <canvas
                          ref={canvasRef}
                          className="hidden"
                          width={640}
                          height={480}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-primary-dark/30">
                        {isStreaming && (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <div className="h-8 w-8 text-accent-blue animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                              </svg>
                            </div>
                            <p className="text-muted-foreground">Listening...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NeuralVideoContainer>

              {/* Media Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <NeuralMediaControls
                  isMicrophoneActive={isStreaming && chatMode === 'audio'}
                  isCameraActive={videoSource === 'camera'}
                  onMicrophoneClick={() => {
                    if (isStreaming) {
                      stopStream();
                    } else {
                      startStream('audio');
                    }
                  }}
                  onCameraClick={() => {
                    if (videoSource === 'camera') {
                      stopStream();
                    } else {
                      startStream('camera');
                    }
                  }}
                />
              </div>
            </div>

            {/* Conversation Display */}
            {text && (
              <div className="mt-6 p-6 floating-card">
                <h2 className="text-lg font-semibold mb-2">Conversation:</h2>
                <pre className="whitespace-pre-wrap text-muted-foreground">{text}</pre>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <NeuralSettingsPanel>
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Settings</h2>
                
                <NeuralTextarea
                  label="System Prompt"
                  placeholder="Enter instructions for Gemini..."
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  rows={4}
                />

                <NeuralSelect
                  label="Voice"
                  options={voiceOptions}
                  value={config.voice}
                  onChange={(e) => setConfig({ ...config, voice: e.target.value })}
                />

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </NeuralSettingsPanel>
          </div>
        </div>
      </div>
    </main>
  );
}