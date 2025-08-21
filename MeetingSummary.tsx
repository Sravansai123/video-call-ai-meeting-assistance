import React from 'react';
import { X, FileText, Clock, MessageCircle, Code } from 'lucide-react';
import { MeetingSummary as SummaryType } from '../types';

interface MeetingSummaryProps {
  summary: SummaryType;
  onClose: () => void;
}

export const MeetingSummary: React.FC<MeetingSummaryProps> = ({ summary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Meeting Summary</h2>
              <p className="text-sm text-gray-500">
                Generated at {summary.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Messages</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{summary.totalMessages}</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">Duration</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{summary.duration}</div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Code Snippets</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">{summary.codeSnippets}</div>
            </div>
          </div>
          
          {summary.keyTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Topics Discussed</h3>
              <div className="space-y-2">
                {summary.keyTopics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Session Notes</h4>
            <p className="text-sm text-gray-600">
              This meeting session included {summary.totalMessages} messages with the AI assistant. 
              The assistant provided helpful responses with clear formatting and 
              {summary.codeSnippets > 0 && ` ${summary.codeSnippets} code examples`}.
              All conversations were handled professionally to support your meeting objectives.
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
