import { useState, useEffect, useRef, useCallback } from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import Header from './Header';
import Toolbar from './Toolbar';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import { useEditorStore } from '../store/editorStore';
import { insertMarkdown } from '../utils/toolbarActions';

export default function Editor() {
  const { 
    content, 
    undo, 
    redo, 
    pushToHistory 
  } = useEditorStore();
  const [theme, setTheme] = useState('dark');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleToolbarAction = (action: string, value?: string) => {
    if (editorRef.current) {
      const newContent = insertMarkdown(editorRef.current, action, value);
      if (newContent !== undefined) pushToHistory(newContent);
    }
  };

  const handleContentChange = (newContent: string) => {
    pushToHistory(newContent);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Scroll sync handlers
  const handleEditorScroll = () => {
    if (editorRef.current && previewRef.current) {
      const editorScrollTop = editorRef.current.scrollTop;
      const editorScrollHeight = editorRef.current.scrollHeight - editorRef.current.clientHeight;

      const previewScrollHeight = previewRef.current.scrollHeight - previewRef.current.clientHeight;
      const scrollRatio = editorScrollTop / editorScrollHeight;

      previewRef.current.scrollTop = scrollRatio * previewScrollHeight;
    }
  };

  const handlePreviewScroll = () => {
    if (editorRef.current && previewRef.current) {
      const previewScrollTop = previewRef.current.scrollTop;
      const previewScrollHeight = previewRef.current.scrollHeight - previewRef.current.clientHeight;

      const editorScrollHeight = editorRef.current.scrollHeight - editorRef.current.clientHeight;
      const scrollRatio = previewScrollTop / previewScrollHeight;

      editorRef.current.scrollTop = scrollRatio * editorScrollHeight;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onDownload={handleDownload}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Toolbar onAction={handleToolbarAction} />
          <div className="flex items-center ml-4 space-x-2">
            <button
              onClick={undo}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={redo}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MarkdownEditor
            value={content}
            onChange={handleContentChange}
            ref={editorRef}
            onScroll={handleEditorScroll}
          />
          <MarkdownPreview
            content={content}
            ref={previewRef}
            onScroll={handlePreviewScroll}
          />
        </main>
      </div>
      
    </div>
  );
}
