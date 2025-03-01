'use client';

import { useState } from 'react';
import { NeuralControl, NeuralControls } from './neural-controls';

interface NeuralMediaControlsProps {
  onMicrophoneClick?: () => void;
  onCameraClick?: () => void;
  isMicrophoneActive?: boolean;
  isCameraActive?: boolean;
}

export function NeuralMediaControls({
  onMicrophoneClick,
  onCameraClick,
  isMicrophoneActive = false,
  isCameraActive = false,
}: NeuralMediaControlsProps) {
  return (
    <NeuralControls>
      {/* Microphone Control */}
      <NeuralControl
        isActive={isMicrophoneActive}
        onClick={onMicrophoneClick}
        label="Toggle Microphone"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {isMicrophoneActive ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3zM9.75 20.25h4.5"
              />
            )}
          </svg>
        }
      />

      {/* Camera Control */}
      <NeuralControl
        isActive={isCameraActive}
        onClick={onCameraClick}
        label="Toggle Camera"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {isCameraActive ? (
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V7.5A2.25 2.25 0 014.5 5.25h9a2.25 2.25 0 012.25 2.25v4.5"
              />
            )}
          </svg>
        }
      />
    </NeuralControls>
  );
} 