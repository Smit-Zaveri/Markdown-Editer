import React, { useState } from 'react';
import { Search, Settings, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, options: SearchOptions) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  matchCount: number;
  currentMatch: number;
}

interface SearchOptions {
  caseSensitive: boolean;
  regex: boolean;
  wholeWord: boolean;
}

export default function SearchBar({ onSearch, onNavigate, matchCount, currentMatch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<SearchOptions>({
    caseSensitive: false,
    regex: false,
    wholeWord: false,
  });
  const [showOptions, setShowOptions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, options);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value, options);
            }}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
                     dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {matchCount > 0 && (
          <div className="flex items-center ml-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentMatch + 1} of {matchCount}
            </span>
            <div className="flex ml-2">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </form>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                      border border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="space-y-3">
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    const newOptions = { ...options, [key]: e.target.checked };
                    setOptions(newOptions);
                    onSearch(query, newOptions);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}