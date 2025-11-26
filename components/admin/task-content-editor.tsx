'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { ImageUpload } from '@/components/ui/file-upload'
import { PdfUpload } from '@/components/ui/file-upload'

export type TaskContentType = 'TEXT' | 'VIDEO' | 'PDF' | 'IMAGE' | 'LINK' | 'CODE'

export interface TaskContentBlock {
  id: string
  contentType: TaskContentType
  orderIndex: number
  textContent?: string
  videoUrl?: string
  fileUrl?: string
  fileName?: string
  linkUrl?: string
  linkTitle?: string
}

const contentTypeConfig = {
  TEXT: {
    label: 'Text Block',
    icon: Type,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    description: 'Add formatted text content (supports markdown)'
  },
  VIDEO: {
    label: 'YouTube Video',
    icon: Video,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    description: 'Embed a YouTube video'
  },
  PDF: {
    label: 'PDF Document',
    icon: FileText,
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    description: 'Upload a PDF file'
  },
  IMAGE: {
    label: 'Image',
    icon: ImageIcon,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
    description: 'Upload an image'
  },
  LINK: {
    label: 'External Link',
    icon: LinkIcon,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    description: 'Add a link to external resource'
  },
  CODE: {
    label: 'Code Snippet',
    icon: Code,
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    description: 'Add a code block with syntax highlighting'
  }
}

interface TaskContentEditorProps {
  contents: TaskContentBlock[]
  onChange: (contents: TaskContentBlock[]) => void
}

export function TaskContentEditor({ contents, onChange }: TaskContentEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  const generateId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addContentBlock = useCallback((type: TaskContentType) => {
    const newBlock: TaskContentBlock = {
      id: generateId(),
      contentType: type,
      orderIndex: contents.length
    }
    onChange([...contents, newBlock])
    setShowAddMenu(false)
  }, [contents, onChange])

  const updateContentBlock = useCallback((id: string, updates: Partial<TaskContentBlock>) => {
    onChange(contents.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }, [contents, onChange])

  const removeContentBlock = useCallback((id: string) => {
    const filtered = contents.filter(block => block.id !== id)
    // Reindex
    const reindexed = filtered.map((block, index) => ({
      ...block,
      orderIndex: index
    }))
    onChange(reindexed)
  }, [contents, onChange])

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    const index = contents.findIndex(b => b.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= contents.length) return

    const newContents = [...contents]
    const [removed] = newContents.splice(index, 1)
    newContents.splice(newIndex, 0, removed)
    
    // Reindex
    const reindexed = newContents.map((block, idx) => ({
      ...block,
      orderIndex: idx
    }))
    onChange(reindexed)
  }, [contents, onChange])

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Task Content
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add text, videos, PDFs, and more
        </p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-3">
        {contents
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((block, index) => {
            const config = contentTypeConfig[block.contentType]
            const Icon = config.icon

            return (
              <Card key={block.id} className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  {/* Block Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      <Badge className={config.color} variant="outline">
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={index === contents.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContentBlock(block.id)}
                        className="h-7 w-7 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Block Content */}
                  {block.contentType === 'TEXT' && (
                    <div>
                      <textarea
                        value={block.textContent || ''}
                        onChange={(e) => updateContentBlock(block.id, { textContent: e.target.value })}
                        placeholder="Enter text content (supports markdown)..."
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Supports markdown: **bold**, *italic*, # headings, - lists, [links](url)
                      </p>
                    </div>
                  )}

                  {block.contentType === 'VIDEO' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={block.videoUrl || ''}
                        onChange={(e) => updateContentBlock(block.id, { videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {block.videoUrl && getYouTubeEmbedUrl(block.videoUrl) && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                          <iframe
                            src={getYouTubeEmbedUrl(block.videoUrl) || ''}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {block.contentType === 'PDF' && (
                    <div>
                      {block.fileUrl ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <FileText className="w-8 h-8 text-orange-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {block.fileName || 'PDF Document'}
                            </p>
                            <a
                              href={block.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              View PDF <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateContentBlock(block.id, { fileUrl: undefined, fileName: undefined })}
                            className="text-red-600 dark:text-red-400"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <PdfUpload
                          value=""
                          onChange={(url) => updateContentBlock(block.id, { 
                            fileUrl: Array.isArray(url) ? url[0] : url,
                            fileName: 'Uploaded PDF'
                          })}
                        />
                      )}
                    </div>
                  )}

                  {block.contentType === 'IMAGE' && (
                    <div>
                      {block.fileUrl ? (
                        <div className="space-y-2">
                          <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                            <img
                              src={block.fileUrl}
                              alt={block.fileName || 'Uploaded image'}
                              className="max-w-full max-h-64 mx-auto object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {block.fileName || 'Uploaded image'}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateContentBlock(block.id, { fileUrl: undefined, fileName: undefined })}
                              className="text-red-600 dark:text-red-400"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ImageUpload
                          value=""
                          onChange={(url) => updateContentBlock(block.id, { 
                            fileUrl: Array.isArray(url) ? url[0] : url,
                            fileName: 'Uploaded Image'
                          })}
                        />
                      )}
                    </div>
                  )}

                  {block.contentType === 'LINK' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.linkTitle || ''}
                        onChange={(e) => updateContentBlock(block.id, { linkTitle: e.target.value })}
                        placeholder="Link title (e.g., Official Documentation)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        value={block.linkUrl || ''}
                        onChange={(e) => updateContentBlock(block.id, { linkUrl: e.target.value })}
                        placeholder="https://example.com/resource"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {block.linkUrl && (
                        <a
                          href={block.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Preview link
                        </a>
                      )}
                    </div>
                  )}

                  {block.contentType === 'CODE' && (
                    <div>
                      <textarea
                        value={block.textContent || ''}
                        onChange={(e) => updateContentBlock(block.id, { textContent: e.target.value })}
                        placeholder="// Enter code snippet here..."
                        rows={8}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-900 text-green-400 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Add code with syntax highlighting
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
      </div>

      {/* Empty State */}
      {contents.length === 0 && (
        <Card className="p-8 border-dashed border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-3">
              <Plus className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
              No content yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Add content blocks like text, videos, PDFs, or links
            </p>
          </div>
        </Card>
      )}

      {/* Add Content Menu */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full border-dashed border-2 py-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content Block
        </Button>

        {showAddMenu && (
          <Card className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(Object.entries(contentTypeConfig) as [TaskContentType, typeof contentTypeConfig.TEXT][]).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addContentBlock(type)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {config.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
