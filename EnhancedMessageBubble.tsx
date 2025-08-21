import React from 'react';
import { Bot, User, Copy, Check, Database, Brain } from 'lucide-react';
import { Message } from '../types';

interface EnhancedMessageBubbleProps {
  message: Message;
}

export const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderContent = (content: string) => {
    // Simple code block detection and rendering
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a code block
          const lines = part.split('\n');
          const language = lines[0].trim();
          const code = lines.slice(1).join('\n').trim();
          
          return (
            <div key={index} className="my-3 bg-gray-900 rounded-lg p-4 relative group">
              {language && (
                <div className="text-xs text-gray-400 mb-2 font-mono">{language}</div>
              )}
              <pre className="text-sm text-gray-100 font-mono overflow-x-auto">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(code)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gray-800 rounded-md hover:bg-gray-700"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          );
        }
        
        // Regular text with bullet points
        return (
          <div key={index} className="whitespace-pre-wrap">
            {part.split('\n').map((line, lineIndex) => {
              if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                return (
                  <div key={lineIndex} className="flex items-start space-x-2 my-1">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{line.trim().substring(2)}</span>
                  </div>
                );
              }
              return <div key={lineIndex}>{line}</div>;
            })}
          </div>
        );
      });
    }

    // Handle bullet points without code blocks
    return (
      <div className="whitespace-pre-wrap">
        {content.split('\n').map((line, index) => {
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return (
              <div key={index} className="flex items-start space-x-2 my-1">
                <span className="text-blue-600 font-bold">•</span>
                <span>{line.trim().substring(2)}</span>
              </div>
            );
          }
          return <div key={index}>{line}</div>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex items-start space-x-3 p-4 ${
      message.type === 'assistant' ? 'bg-blue-50' : 'bg-white'
    } rounded-lg shadow-sm border border-gray-100 animate-slideIn`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        message.type === 'assistant' ? 'bg-blue-600' : 'bg-gray-600'
      }`}>
        {message.type === 'assistant' ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {message.type === 'assistant' ? 'AI Assistant' : 'You'}
          </span>
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          
          {/* Source indicator for assistant messages */}
          {message.type === 'assistant' && message.source && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              message.source === 'dataset' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {message.source === 'dataset' ? (
                <Database className="w-3 h-3" />
              ) : (
                <Brain className="w-3 h-3" />
              )}
              <span>{message.source === 'dataset' ? 'Dataset' : 'AI'}</span>
            </div>
          )}
        </div>
        
        <div className="text-gray-800 text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};
