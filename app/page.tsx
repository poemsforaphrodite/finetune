'use client';

import { useState, useRef } from 'react';
import { logger } from '@/utils/logger';
import { FiUpload, FiPlay, FiAlertCircle } from 'react-icons/fi';

export default function VoiceCloning() {
  const [text, setText] = useState(
    "مرحباً بكم في تطبيق استنساخ الصوت. يمكنك استخدام هذا التطبيق لإنشاء نسخة من صوتك باللغة العربية."
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (!audioFile) {
        throw new Error('Please upload an audio file first');
      }

      const formData = new FormData();
      formData.append('text', text);
      formData.append('audio_file', audioFile);

      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to clone voice');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);

    } catch (err) {
      logger.error(err instanceof Error ? err.message : 'Unknown error occurred');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Voice Cloning App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Transform your voice with our advanced AI technology
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Text Input Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Enter text to synthesize
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 border border-gray-200 dark:border-gray-700 rounded-xl 
                       bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 
                       text-gray-800 dark:text-gray-200 transition-all duration-200"
              dir="rtl"
              placeholder="Enter your text here..."
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload your audio file
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 
                         rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 
                         transition-all duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,.mp3"
                onChange={handleFileChange}
                className="hidden"
              />
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {audioFile ? audioFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                WAV or MP3 files only
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !audioFile}
            className={`w-full py-3 px-6 rounded-xl text-white font-medium
                       transition-all duration-200 transform hover:scale-[1.02]
                       ${loading || !audioFile
                         ? 'bg-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                       }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Processing...
              </div>
            ) : (
              'Clone Voice'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 
                           text-red-700 dark:text-red-300 rounded-xl">
              <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Audio Player */}
          {result && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FiPlay className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Generated Audio
                </h3>
              </div>
              <audio 
                ref={audioRef} 
                controls 
                src={result} 
                className="w-full custom-audio-player"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
