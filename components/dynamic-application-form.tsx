'use client'

import { useState } from 'react'
import { ImageUpload, PdfUpload } from '@/components/ui/file-upload'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Types matching Prisma schema
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

interface ApplicationField {
  id: string
  type: FieldType
  label: string
  placeholder: string | null
  helpText: string | null
  options: string | null
  isRequired: boolean
  width: string
}

interface ApplicationStep {
  id: string
  title: string
  description: string | null
  isRequired: boolean
  fields: ApplicationField[]
}

interface DynamicApplicationFormProps {
  steps: ApplicationStep[]
  internshipId: string
  onSubmit: (data: Record<string, any>) => Promise<void>
  isSubmitting?: boolean
}

const inputClass = "w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
const textClass = "text-slate-600 dark:text-slate-400"

export function DynamicApplicationForm({ 
  steps, 
  internshipId, 
  onSubmit, 
  isSubmitting = false 
}: DynamicApplicationFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    currentStep.fields.forEach(field => {
      if (field.isRequired) {
        const value = formData[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
      
      // Email validation
      if (field.type === 'EMAIL' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address'
        }
      }
      
      // URL validation
      if (field.type === 'URL' && formData[field.id]) {
        try {
          new URL(formData[field.id])
        } catch {
          newErrors[field.id] = 'Please enter a valid URL'
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) {
      return
    }
    
    await onSubmit(formData)
  }

  const renderField = (field: ApplicationField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]
    const widthClass = field.width === 'full' ? 'col-span-full' : field.width === 'half' ? 'col-span-1' : 'col-span-1 md:col-span-1'
    
    // Display-only fields
    if (field.type === 'HEADING') {
      return (
        <div key={field.id} className={`${widthClass} pt-4`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {field.label}
          </h3>
          {field.helpText && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{field.helpText}</p>
          )}
        </div>
      )
    }
    
    if (field.type === 'PARAGRAPH') {
      return (
        <div key={field.id} className={widthClass}>
          <p className="text-slate-700 dark:text-slate-300">{field.label}</p>
          {field.helpText && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{field.helpText}</p>
          )}
        </div>
      )
    }

    return (
      <div key={field.id} className={widthClass}>
        <label className={labelClass}>
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* TEXT */}
        {field.type === 'TEXT' && (
          <input
            type="text"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* TEXTAREA */}
        {field.type === 'TEXTAREA' && (
          <textarea
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* EMAIL */}
        {field.type === 'EMAIL' && (
          <input
            type="email"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || 'example@email.com'}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* PHONE */}
        {field.type === 'PHONE' && (
          <input
            type="tel"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || '+1 (555) 123-4567'}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* URL */}
        {field.type === 'URL' && (
          <input
            type="url"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || 'https://example.com'}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* NUMBER */}
        {field.type === 'NUMBER' && (
          <input
            type="number"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* DATE */}
        {field.type === 'DATE' && (
          <input
            type="date"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={inputClass}
            required={field.isRequired}
          />
        )}
        
        {/* IMAGE UPLOAD */}
        {field.type === 'IMAGE' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
            <ImageUpload
              value={value}
              onChange={(url) => updateField(field.id, url)}
            />
            {field.helpText && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{field.helpText}</p>
            )}
          </div>
        )}
        
        {/* PDF UPLOAD */}
        {field.type === 'PDF' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
            <PdfUpload
              value={value}
              onChange={(url: string | string[]) => updateField(field.id, url)}
            />
            {field.helpText && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{field.helpText}</p>
            )}
          </div>
        )}
        
        {/* SELECT */}
        {field.type === 'SELECT' && (
          <select
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={inputClass}
            required={field.isRequired}
          >
            <option value="">Select an option...</option>
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        
        {/* MULTI_SELECT */}
        {field.type === 'MULTI_SELECT' && (
          <div className="space-y-2">
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const currentValues = value || []
                    const newValues = e.target.checked
                      ? [...currentValues, opt]
                      : currentValues.filter((v: string) => v !== opt)
                    updateField(field.id, newValues)
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {/* RADIO */}
        {field.type === 'RADIO' && (
          <div className="space-y-2">
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                  required={field.isRequired}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {/* CHECKBOX */}
        {field.type === 'CHECKBOX' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateField(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
              required={field.isRequired}
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">{field.helpText || 'Yes'}</span>
          </label>
        )}
        
        {field.helpText && !['CHECKBOX', 'IMAGE', 'PDF'].includes(field.type) && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{field.helpText}</p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
        )}
      </div>
    )
  }

  if (!currentStep) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div>
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                  ${idx < currentStepIndex ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 
                    idx === currentStepIndex ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg shadow-blue-500/30' : 
                    'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
                `}>
                  {idx < currentStepIndex ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </div>
                <p className={`text-xs mt-2 text-center hidden sm:block transition-colors duration-300 max-w-[100px] ${
                  idx === currentStepIndex ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${
                  idx < currentStepIndex ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className={textClass}>{currentStep.description}</p>
          )}
          <p className={`${textClass} text-sm mt-1`}>
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentStep.fields.map(renderField)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t-2 border-slate-100 dark:border-slate-800">
          {currentStepIndex > 0 ? (
            <Button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              variant="outline"
              className="px-6"
            >
              Back
            </Button>
          ) : <div />}

          {!isLastStep ? (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto"
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
