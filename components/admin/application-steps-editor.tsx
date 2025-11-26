'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Copy, 
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
  Type,
  AlignLeft,
  Mail,
  Phone,
  Link as LinkIcon,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
  Hash,
  Heading,
  FileText,
  MoreHorizontal,
  Save,
  X
} from 'lucide-react'
import {
  createApplicationStep,
  updateApplicationStep,
  deleteApplicationStep,
  reorderApplicationSteps,
  createApplicationField,
  updateApplicationField,
  deleteApplicationField,
  reorderApplicationFields,
  duplicateApplicationStep,
  createDefaultApplicationSteps
} from '@/app/actions/application-steps'

// Types
type FieldType = 
  | 'TEXT'
  | 'TEXTAREA'
  | 'EMAIL'
  | 'PHONE'
  | 'URL'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'DATE'
  | 'IMAGE'
  | 'PDF'
  | 'NUMBER'
  | 'HEADING'
  | 'PARAGRAPH'

type ApplicationField = {
  id: string
  stepId: string
  type: FieldType
  label: string
  placeholder: string | null
  helpText: string | null
  options: string | null
  validation: string | null
  defaultValue: string | null
  order: number
  isRequired: boolean
  isActive: boolean
  width: string
}

type ApplicationStep = {
  id: string
  internshipId: string
  title: string
  description: string | null
  order: number
  isRequired: boolean
  isActive: boolean
  fields: ApplicationField[]
}

type Props = {
  internshipId: string
  initialSteps: ApplicationStep[]
}

// Field type icons
const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  TEXT: <Type className="w-4 h-4" />,
  TEXTAREA: <AlignLeft className="w-4 h-4" />,
  EMAIL: <Mail className="w-4 h-4" />,
  PHONE: <Phone className="w-4 h-4" />,
  URL: <LinkIcon className="w-4 h-4" />,
  SELECT: <List className="w-4 h-4" />,
  MULTI_SELECT: <CheckSquare className="w-4 h-4" />,
  RADIO: <Circle className="w-4 h-4" />,
  CHECKBOX: <CheckSquare className="w-4 h-4" />,
  DATE: <Calendar className="w-4 h-4" />,
  IMAGE: <Upload className="w-4 h-4" />,
  PDF: <FileText className="w-4 h-4" />,
  NUMBER: <Hash className="w-4 h-4" />,
  HEADING: <Heading className="w-4 h-4" />,
  PARAGRAPH: <FileText className="w-4 h-4" />,
}

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: 'Text Input',
  TEXTAREA: 'Text Area',
  EMAIL: 'Email',
  PHONE: 'Phone',
  URL: 'URL/Link',
  SELECT: 'Dropdown',
  MULTI_SELECT: 'Multi-Select',
  RADIO: 'Radio Buttons',
  CHECKBOX: 'Checkbox',
  DATE: 'Date Picker',
  IMAGE: 'Image Upload',
  PDF: 'PDF Upload',
  NUMBER: 'Number',
  HEADING: 'Heading',
  PARAGRAPH: 'Paragraph',
}

export function ApplicationStepsEditor({ internshipId, initialSteps }: Props) {
  const [steps, setSteps] = useState<ApplicationStep[]>(initialSteps)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(initialSteps.map(s => s.id)))
  const [isPending, startTransition] = useTransition()
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [showAddField, setShowAddField] = useState<string | null>(null)

  // Toggle step expansion
  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  // Add new step
  const handleAddStep = () => {
    startTransition(async () => {
      const result = await createApplicationStep({
        internshipId,
        title: 'New Step',
        description: '',
        isRequired: true
      })
      if (result.success && result.data) {
        setSteps(prev => [...prev, result.data as ApplicationStep])
        setExpandedSteps(prev => new Set([...prev, result.data!.id]))
        setEditingStep(result.data.id)
      }
    })
  }

  // Create default steps
  const handleCreateDefaults = () => {
    startTransition(async () => {
      const result = await createDefaultApplicationSteps(internshipId)
      if (result.success) {
        // Refresh page to get the new steps
        window.location.reload()
      }
    })
  }

  // Update step
  const handleUpdateStep = (stepId: string, data: { title?: string; description?: string; isRequired?: boolean; isActive?: boolean }) => {
    startTransition(async () => {
      const result = await updateApplicationStep(stepId, data)
      if (result.success && result.data) {
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...result.data } : s))
        setEditingStep(null)
      }
    })
  }

  // Delete step
  const handleDeleteStep = (stepId: string) => {
    if (!confirm('Are you sure you want to delete this step and all its fields?')) return
    
    startTransition(async () => {
      const result = await deleteApplicationStep(stepId)
      if (result.success) {
        setSteps(prev => prev.filter(s => s.id !== stepId))
      }
    })
  }

  // Duplicate step
  const handleDuplicateStep = (stepId: string) => {
    startTransition(async () => {
      const result = await duplicateApplicationStep(stepId)
      if (result.success && result.data) {
        setSteps(prev => [...prev, result.data as ApplicationStep])
        setExpandedSteps(prev => new Set([...prev, result.data!.id]))
      }
    })
  }

  // Toggle step active
  const handleToggleStepActive = (stepId: string, isActive: boolean) => {
    startTransition(async () => {
      const result = await updateApplicationStep(stepId, { isActive })
      if (result.success) {
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, isActive } : s))
      }
    })
  }

  // Add field to step
  const handleAddField = (stepId: string, type: FieldType) => {
    startTransition(async () => {
      const result = await createApplicationField({
        stepId,
        type,
        label: `New ${fieldTypeLabels[type]}`,
        isRequired: false,
        width: 'full'
      })
      if (result.success && result.data) {
        setSteps(prev => prev.map(s => {
          if (s.id === stepId) {
            return { ...s, fields: [...s.fields, result.data as ApplicationField] }
          }
          return s
        }))
        setShowAddField(null)
        setEditingField(result.data.id)
      }
    })
  }

  // Update field
  const handleUpdateField = (stepId: string, fieldId: string, data: { label?: string; placeholder?: string | null; helpText?: string | null; isRequired?: boolean; isActive?: boolean; width?: string; options?: string | null }) => {
    startTransition(async () => {
      const result = await updateApplicationField(fieldId, { ...data, placeholder: data.placeholder || undefined, helpText: data.helpText || undefined, options: data.options || undefined })
      if (result.success && result.data) {
        setSteps(prev => prev.map(s => {
          if (s.id === stepId) {
            return {
              ...s,
              fields: s.fields.map(f => f.id === fieldId ? { ...f, ...result.data } : f)
            }
          }
          return s
        }))
        setEditingField(null)
      }
    })
  }

  // Delete field
  const handleDeleteField = (stepId: string, fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return
    
    startTransition(async () => {
      const result = await deleteApplicationField(fieldId)
      if (result.success) {
        setSteps(prev => prev.map(s => {
          if (s.id === stepId) {
            return { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          }
          return s
        }))
      }
    })
  }

  // Move step up/down
  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = steps.findIndex(s => s.id === stepId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= steps.length) return
    
    const newSteps = [...steps]
    const [removed] = newSteps.splice(currentIndex, 1)
    newSteps.splice(newIndex, 0, removed)
    
    setSteps(newSteps)
    
    startTransition(async () => {
      await reorderApplicationSteps(internshipId, newSteps.map(s => s.id))
    })
  }

  // Empty state
  if (steps.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No Application Steps Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Create custom application steps to collect the information you need from applicants.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={handleCreateDefaults}
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isPending ? 'Creating...' : 'Use Default Template'}
            </Button>
            <Button
              onClick={handleAddStep}
              disabled={isPending}
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start from Scratch
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {steps.filter(s => s.isActive).length} active
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/internships/${internshipId}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
          <Button onClick={handleAddStep} disabled={isPending} size="sm" className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 gap-1.5">
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Steps List */}
      {steps.map((step, stepIndex) => (
        <Card 
          key={step.id} 
          className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/50 rounded-xl overflow-hidden ${
            !step.isActive ? 'opacity-60' : ''
          }`}
        >
          {/* Step Header */}
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleMoveStep(step.id, 'up')}
                  disabled={stepIndex === 0 || isPending}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 rounded"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveStep(step.id, 'down')}
                  disabled={stepIndex === steps.length - 1 || isPending}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 rounded"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                {editingStep === step.id ? (
                  <StepEditor 
                    step={step}
                    onSave={(data) => handleUpdateStep(step.id, data)}
                    onCancel={() => setEditingStep(null)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold">
                      {stepIndex + 1}
                    </span>
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                      {step.title}
                    </h3>
                    {step.isRequired && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700/50">
                        Required
                      </Badge>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {step.fields.length} field{step.fields.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              {editingStep !== step.id && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {expandedSteps.has(step.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingStep(step.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStepActive(step.id, !step.isActive)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={step.isActive ? 'Disable step' : 'Enable step'}
                  >
                    {step.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDuplicateStep(step.id)}
                    disabled={isPending}
                    className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    disabled={isPending}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Step Fields */}
          {expandedSteps.has(step.id) && (
            <div className="p-4 space-y-2">
              {step.fields.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                  <FileText className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields yet. Add your first field below.</p>
                </div>
              ) : (
                step.fields.map((field, fieldIndex) => (
                  <FieldItem
                    key={field.id}
                    field={field}
                    isEditing={editingField === field.id}
                    onEdit={() => setEditingField(field.id)}
                    onSave={(data) => handleUpdateField(step.id, field.id, data)}
                    onCancel={() => setEditingField(null)}
                    onDelete={() => handleDeleteField(step.id, field.id)}
                    isPending={isPending}
                  />
                ))
              )}
              
              {/* Add Field Button */}
              {showAddField === step.id ? (
                <FieldTypePicker
                  onSelect={(type) => handleAddField(step.id, type)}
                  onCancel={() => setShowAddField(null)}
                />
              ) : (
                <Button
                  onClick={() => setShowAddField(step.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Field
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}
      
      {/* Add Step Button */}
      <Button
        onClick={handleAddStep}
        disabled={isPending}
        variant="outline"
        className="w-full py-5 border-dashed border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 rounded-xl"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Step
      </Button>
    </div>
  )
}

// Step Editor Component
function StepEditor({ 
  step, 
  onSave, 
  onCancel 
}: { 
  step: ApplicationStep
  onSave: (data: { title?: string; description?: string; isRequired?: boolean }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(step.title)
  const [description, setDescription] = useState(step.description || '')
  const [isRequired, setIsRequired] = useState(step.isRequired)

  return (
    <div className="flex-1 space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Step title"
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Required</span>
        </label>
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Step description (optional)"
        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onSave({ title, description: description || undefined, isRequired })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-3 h-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Field Item Component
function FieldItem({
  field,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isPending
}: {
  field: ApplicationField
  isEditing: boolean
  onEdit: () => void
  onSave: (data: Partial<ApplicationField>) => void
  onCancel: () => void
  onDelete: () => void
  isPending: boolean
}) {
  if (isEditing) {
    return <FieldEditor field={field} onSave={onSave} onCancel={onCancel} />
  }

  return (
    <div className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group ${
      !field.isActive ? 'opacity-50' : ''
    }`}>
      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
      
      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400">
        {fieldTypeIcons[field.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900 dark:text-white truncate">
            {field.label}
          </span>
          {field.isRequired && (
            <span className="text-red-500 text-sm">*</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{fieldTypeLabels[field.type]}</span>
          {field.width !== 'full' && (
            <span>• {field.width} width</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={isPending}
          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Field Editor Component
function FieldEditor({
  field,
  onSave,
  onCancel
}: {
  field: ApplicationField
  onSave: (data: Partial<ApplicationField>) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState(field.label)
  const [placeholder, setPlaceholder] = useState(field.placeholder || '')
  const [helpText, setHelpText] = useState(field.helpText || '')
  const [isRequired, setIsRequired] = useState(field.isRequired)
  const [width, setWidth] = useState(field.width)
  const [options, setOptions] = useState(field.options || '')

  const showOptions = ['SELECT', 'MULTI_SELECT', 'RADIO'].includes(field.type)

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Placeholder</label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Help Text</label>
        <input
          type="text"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
          placeholder="Additional instructions for this field"
          className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm"
        />
      </div>

      {showOptions && (
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Options (JSON array, e.g., ["Option 1", "Option 2"])
          </label>
          <input
            type="text"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder='["Option 1", "Option 2", "Option 3"]'
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm font-mono"
          />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Required</span>
        </label>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 dark:text-slate-300">Width:</span>
          <select
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-900 dark:text-white"
          >
            <option value="full">Full</option>
            <option value="half">Half</option>
            <option value="third">Third</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={() => onSave({ 
            label, 
            placeholder: placeholder || null, 
            helpText: helpText || null, 
            isRequired, 
            width,
            options: options || null
          })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-3 h-3 mr-1" />
          Save Field
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Field Type Picker Component
function FieldTypePicker({
  onSelect,
  onCancel
}: {
  onSelect: (type: FieldType) => void
  onCancel: () => void
}) {
  const fieldGroups = [
    {
      label: 'Input Fields',
      types: ['TEXT', 'TEXTAREA', 'EMAIL', 'PHONE', 'URL', 'NUMBER', 'DATE'] as FieldType[]
    },
    {
      label: 'Selection Fields',
      types: ['SELECT', 'MULTI_SELECT', 'RADIO', 'CHECKBOX'] as FieldType[]
    },
    {
      label: 'File Uploads',
      types: ['IMAGE', 'PDF'] as FieldType[]
    },
    {
      label: 'Display Elements',
      types: ['HEADING', 'PARAGRAPH'] as FieldType[]
    }
  ]

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Choose Field Type</span>
        <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {fieldGroups.map(group => (
          <div key={group.label}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {group.types.map(type => (
                <button
                  key={type}
                  onClick={() => onSelect(type)}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 transition-colors text-left"
                >
                  <span className="text-slate-500 dark:text-slate-400">{fieldTypeIcons[type]}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{fieldTypeLabels[type]}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
