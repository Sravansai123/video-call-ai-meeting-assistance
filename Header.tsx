import React from 'react';
import { Video, MessageCircle } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  meetingDuration: string;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, meetingDuration }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Meeting Assistant</h1>
            <p className="text-sm text-gray-500">Professional AI Support</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span>{meetingDuration}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
