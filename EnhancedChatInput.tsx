import React, { useState } from 'react';
import { Send, Mic, MicOff, Loader } from 'lucide-react';

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isTyping?: boolean;
  isRecording?: boolean;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  onStartRecording,
  onStopRecording,
  isTyping,
  isRecording
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything during the meeting... (Press Enter to send, Shift+Enter for new line)"
            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-h-[48px] max-h-32"
            rows={1}
            disabled={isTyping}
          />
        </div>
        
        {/* Voice recording button */}
        <button
          type="button"
          onClick={handleRecordingToggle}
          disabled={isTyping}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTyping ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {isRecording && (
        <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span>Recording... Click mic to stop</span>
        </div>
      )}
    </form>
  );
};
