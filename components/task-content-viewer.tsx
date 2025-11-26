'use client'

import { ReactElement } from 'react'
import { Card } from '@/components/ui/card'
import {
  Type,
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  ExternalLink,
  Download
} from 'lucide-react'

export type TaskContentType = 'TEXT' | 'VIDEO' | 'PDF' | 'IMAGE' | 'LINK' | 'CODE'

export interface TaskContentItem {
  id: string
  contentType: TaskContentType
  orderIndex: number
  textContent?: string | null
  videoUrl?: string | null
  fileUrl?: string | null
  fileName?: string | null
  linkUrl?: string | null
  linkTitle?: string | null
}

interface TaskContentViewerProps {
  contents: TaskContentItem[]
}

// Simple markdown-like renderer
function renderMarkdown(text: string): ReactElement {
  const lines = text.split('\n')
  const elements: ReactElement[] = []
  
  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-3">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
          {line.slice(2)}
        </h1>
      )
    } 
    // List items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={index} className="text-slate-700 dark:text-slate-300 ml-4">
          {renderInlineFormatting(line.slice(2))}
        </li>
      )
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '')
      elements.push(
        <li key={index} className="text-slate-700 dark:text-slate-300 ml-4 list-decimal">
          {renderInlineFormatting(content)}
        </li>
      )
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />)
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {renderInlineFormatting(line)}
        </p>
      )
    }
  })
  
  return <>{elements}</>
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Code
  text = text.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>')
  // Links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
  
  return <span dangerouslySetInnerHTML={{ __html: text }} />
}

function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function TaskContentViewer({ contents }: TaskContentViewerProps) {
  if (!contents || contents.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">
          No content available for this task.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {contents
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((content) => {
          switch (content.contentType) {
            case 'TEXT':
              return (
                <div key={content.id} className="prose prose-slate dark:prose-invert max-w-none">
                  {content.textContent && renderMarkdown(content.textContent)}
                </div>
              )

            case 'VIDEO':
              if (!content.videoUrl) return null
              const embedUrl = getYouTubeEmbedUrl(content.videoUrl)
              if (!embedUrl) {
                return (
                  <Card key={content.id} className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Video Link</p>
                        <a
                          href={content.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Watch Video <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </Card>
                )
              }
              return (
                <div key={content.id} className="rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video bg-slate-900">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video content"
                    />
                  </div>
                </div>
              )

            case 'PDF':
              if (!content.fileUrl) return null
              return (
                <Card key={content.id} className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {content.fileName || 'PDF Document'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Click to view or download
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                      <a
                        href={content.fileUrl}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                </Card>
              )

            case 'IMAGE':
              if (!content.fileUrl) return null
              return (
                <div key={content.id} className="rounded-xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-900">
                  <img
                    src={content.fileUrl}
                    alt={content.fileName || 'Task image'}
                    className="w-full max-h-[600px] object-contain"
                  />
                  {content.fileName && (
                    <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{content.fileName}</p>
                    </div>
                  )}
                </div>
              )

            case 'LINK':
              if (!content.linkUrl) return null
              return (
                <Card key={content.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
                  <a
                    href={content.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <LinkIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {content.linkTitle || 'External Resource'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {content.linkUrl}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                  </a>
                </Card>
              )

            case 'CODE':
              if (!content.textContent) return null
              return (
                <div key={content.id} className="rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-slate-800 dark:bg-slate-950 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Code</span>
                  </div>
                  <pre className="bg-slate-900 p-4 overflow-x-auto">
                    <code className="text-sm text-green-400 font-mono whitespace-pre">
                      {content.textContent}
                    </code>
                  </pre>
                </div>
              )

            default:
              return null
          }
        })}
    </div>
  )
}
