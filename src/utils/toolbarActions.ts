import { Editor } from '@tiptap/react';

export const insertMarkdown = (
  editor: HTMLTextAreaElement | null,
  type: string,
  value?: string
) => {
  if (!editor) return;

  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;
  const selectedText = text.substring(start, end).trimEnd(); // Trim trailing spaces
  const lines = selectedText.split('\n');

  const markdownSyntax: Record<
    string,
    (text: string, index?: number) => { text: string; cursorOffset: number }
  > = {
    bold: (text) => ({ text: `**${text}**`, cursorOffset: 2 }),
    italic: (text) => ({ text: `*${text}*`, cursorOffset: 1 }),
    h1: (text) => ({ text: `# ${text}`, cursorOffset: 2 }),
    h2: (text) => ({ text: `## ${text}`, cursorOffset: 3 }),
    bullet: (text) => ({ text: `- ${text}`, cursorOffset: 2 }),
    number: (text, index = 0) => ({
      text: `${index + 1}. ${text}`,
      cursorOffset: `${index + 1}. `.length,
    }),
    quote: (text) => ({ text: `> ${text}`, cursorOffset: 2 }),
    code: (text) => ({ text: `\`\`\`\n${text}\n\`\`\``, cursorOffset: 4 }),
    link: (text) => ({
      text: `[${text}](url)`,
      cursorOffset: text.length + 3,
    }),
    image: () => ({ text: '![alt text](image-url)', cursorOffset: 2 }),
    emoji: () => ({ text: value || '', cursorOffset: 0 }),
  };

  if (type === 'emoji' && value) {
    const newText = text.slice(0, start) + value + text.slice(end);
    editor.value = newText;
    editor.focus();
    editor.setSelectionRange(start + value.length, start + value.length);
    return;
  }

  if (markdownSyntax[type]) {
    let newText = text.slice(0, start);
    let cursorOffset = start;

    if ((type === 'bullet' || type === 'number') && lines.length > 1) {
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          const { text: formattedLine } = markdownSyntax[type](
            trimmedLine,
            index
          );
          newText += formattedLine + '\n';
        } else {
          newText += '\n';
        }
      });

      if (!selectedText.endsWith('\n')) {
        newText = newText.slice(0, -1);
      }
    } else if (type === 'code' && lines.length > 1) {
      newText += '```\n' + selectedText + '\n```';
    } else {
      const { text: formattedText, cursorOffset: offset } =
        markdownSyntax[type](selectedText);
      newText += formattedText;
      cursorOffset += offset;
    }

    newText += text.slice(end);
    editor.value = newText;
    editor.focus();

    const newPosition =
      start + (type === 'code' && lines.length > 1 ? 4 : cursorOffset);
    editor.setSelectionRange(newPosition, newPosition + selectedText.length);
    return;
  }
};


export const applyTipTapAction = (
  editor: Editor | null,
  type: string,
  value?: string
) => {
  if (!editor) return;

  const actions: Record<string, () => void> = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    h1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    h2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    bullet: () => editor.chain().focus().toggleBulletList().run(),
    number: () => editor.chain().focus().toggleOrderedList().run(),
    quote: () => editor.chain().focus().toggleBlockquote().run(),
    code: () => {
      const isMultiLine =
        editor.state.selection.content()?.content?.size > 1;
      if (isMultiLine) {
        editor.chain().focus().toggleCodeBlock().run();
      } else {
        editor.chain().focus().toggleCode().run();
      }
    },
    link: () => {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    image: () => {
      const url = window.prompt('Enter image URL:');
      const alt = window.prompt('Enter image description:');
      if (url) {
        editor.chain().focus().setNode('image', { src: url, alt: alt || '' }).run();
      }
    },
    emoji: () => {
      if (value) {
        editor.chain().focus().insertContent(value).run();
      }
    },
  };

  if (actions[type]) {
    actions[type]();
  }
};

