import React from 'react';

export const AudioWave = ({ isPlaying, isListening, color = 'indigo' }) => {
  if (!isPlaying && !isListening) return null;

  const bgClass = isListening ? 'bg-rose-500' : 'bg-indigo-400';

  return (
    <div className="flex items-center gap-1 h-7 px-2">
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
      <span className={`w-1 rounded-full ${bgClass} audio-bar`} />
    </div>
  );
};
