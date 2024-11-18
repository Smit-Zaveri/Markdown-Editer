import { Download, Github, Moon, Sun } from 'lucide-react';
import IconButton from './IconButton';

interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
  onDownload: () => void;
}

export default function Header({ 
  theme, 
  onThemeToggle, 
  onDownload, 
}: HeaderProps) {

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Markdown Editor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <IconButton
              onClick={onThemeToggle}
              icon={theme === 'light' ? Moon : Sun}
              label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            />
            
            <IconButton onClick={onDownload} icon={Download} label="Download markdown" />
          <IconButton
            onClick={() => window.location.href = 'https://github.com'}
            icon={Github}
            label="GitHub"
          />
          </div>
        </div>
      </div>
    </header>
  );
}