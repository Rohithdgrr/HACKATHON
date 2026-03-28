import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, FileCode } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 hover:bg-white/10 active:scale-95"
      style={{ color: copied ? '#4ade80' : '#9ca3af' }}
    >
      {copied ? (
        <>
          <Check size={12} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

const languageLabels: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript React',
  jsx: 'JavaScript React',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  cs: 'C#',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  rb: 'Ruby',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  markdown: 'Markdown',
  md: 'Markdown',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  r: 'R',
  lua: 'Lua',
  perl: 'Perl',
  scala: 'Scala',
  elixir: 'Elixir',
  haskell: 'Haskell',
  toml: 'TOML',
  ini: 'INI',
  text: 'Plain Text',
  txt: 'Plain Text',
};

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            const isInline = !match && !codeString.includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md text-[13px] font-mono font-semibold"
                  style={{
                    background: '#1e1e2e',
                    color: '#cba6f7',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const lineCount = codeString.split('\n').length;
            const displayLang = languageLabels[language] || language.toUpperCase() || 'CODE';

            return (
              <div
                className="my-3 rounded-xl overflow-hidden shadow-lg"
                style={{
                  background: '#0d1117',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Code block header with metadata */}
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #161b22, #1c2129)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* Traffic light dots */}
                    <div className="flex items-center gap-1.5 mr-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                    </div>
                    <FileCode size={13} style={{ color: '#7c8aaa' }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: '#58a6ff' }}
                    >
                      {displayLang}
                    </span>
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                      style={{ color: '#7c8aaa', background: 'rgba(255,255,255,0.04)' }}
                    >
                      {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                    </span>
                  </div>
                  <CopyButton text={codeString} />
                </div>
                {/* Syntax highlighted code */}
                <SyntaxHighlighter
                  style={oneDark}
                  language={language || 'text'}
                  PreTag="div"
                  showLineNumbers={lineCount > 3}
                  lineNumberStyle={{
                    color: '#3b4252',
                    fontSize: '11px',
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    userSelect: 'none',
                  }}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    background: '#0d1117',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    borderRadius: 0,
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
          // Style other markdown elements
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm font-bold mb-1.5 mt-2 first:mt-0">{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-3 border-blue-400 pl-3 my-2 text-gray-600 italic bg-blue-50/50 py-1 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          strong({ children }) {
            return <strong className="font-bold text-gray-900">{children}</strong>;
          },
          a({ children, href }) {
            return (
              <a href={href} className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-3 border-gray-200" />;
          },
          // Improved table styling for better markdown table rendering
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-50">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left font-bold border-b border-gray-200 text-xs uppercase tracking-wider text-gray-700 bg-gray-100/50">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-3 border-b border-gray-100 text-gray-700 leading-relaxed">
                {children}
              </td>
            );
          },
          // Pre blocks for ASCII diagrams
          pre({ children }) {
            return (
              <pre className="my-3 p-4 rounded-lg bg-gray-50 border border-gray-200 overflow-x-auto font-mono text-sm text-gray-700 leading-relaxed">
                {children}
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
