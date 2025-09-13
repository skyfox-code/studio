
"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LOCAL_STORAGE_KEY = 'notepad-markdown-content';

const defaultMarkdown = `
# Welcome to your Markdown Notepad!

This is a simple notepad that saves your notes in **Markdown** format to your browser's local storage.

## Features
- Write Markdown in the left panel.
- See the rendered HTML in the right panel.
- Your notes are **saved automatically** as you type!

### What is Markdown?
Markdown is a lightweight markup language with plain-text-formatting syntax.

\`\`\`javascript
// You can even write code blocks!
function greet() {
  console.log("Hello, Markdown!");
}
greet();
\`\`\`

> Blockquotes are also supported. Perfect for highlighting important information.

- [x] Task lists are supported too!
- [ ] Finish this awesome demo
- [ ] Drink some coffee

Enjoy your new notepad!
`;

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');

  // Load from localStorage on initial client-side render
  useEffect(() => {
    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    } else {
      setMarkdown(defaultMarkdown);
    }
  }, []);

  // Save to localStorage whenever markdown changes
  useEffect(() => {
    if (markdown !== defaultMarkdown || !localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, markdown);
    }
  }, [markdown]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[60vh]">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Markdown Input</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target..value)}
            className="w-full h-full min-h-[50vh] resize-none text-base font-mono"
            placeholder="Type your markdown here..."
          />
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Rendered Output</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="prose dark:prose-invert max-w-none w-full h-full min-h-[50vh] p-4 border rounded-md overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    