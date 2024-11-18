import { create } from 'zustand';

interface EditorState {
  content: string;
  versionHistory: Array<{
    content: string;
    timestamp: number;
    id: string;
  }>;
  currentVersion: string;
  undoStack: string[];
  redoStack: string[];
  setContent: (content: string) => void;
  addVersion: (content: string) => void;
  setVersion: (id: string) => void;
  undo: () => void;
  redo: () => void;
  pushToHistory: (content: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '# Welcome to the Enhanced Markdown Editor\n\nStart typing to see the magic happen!',
  versionHistory: [],
  currentVersion: 'latest',
  undoStack: [],
  redoStack: [],
  setContent: (content) => set({ content }),
  addVersion: (content) =>
    set((state) => ({
      versionHistory: [
        ...state.versionHistory,
        { content, timestamp: Date.now(), id: Date.now().toString() },
      ],
    })),
  setVersion: (id) =>
    set((state) => ({
      currentVersion: id,
      content:
        state.versionHistory.find((v) => v.id === id)?.content || state.content,
    })),
  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const newContent = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);
      return {
        content: newContent,
        undoStack: newUndoStack,
        redoStack: [state.content, ...state.redoStack],
      };
    }),
  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const newContent = state.redoStack[0];
      const newRedoStack = state.redoStack.slice(1);
      return {
        content: newContent,
        undoStack: [...state.undoStack, state.content],
        redoStack: newRedoStack,
      };
    }),
  pushToHistory: (content) =>
    set((state) => {
      if (content === state.content) return state;
      return {
        content,
        undoStack: [...state.undoStack, state.content],
        redoStack: [],
      };
    }),
}));