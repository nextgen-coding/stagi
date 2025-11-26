'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react'
import { ImageUpload, PdfUpload } from '@/components/ui/file-upload'

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
  isActive: boolean
}

interface ApplicationStep {
  id: string
  title: string
  description: string | null
  isRequired: boolean
  isActive: boolean
  fields: ApplicationField[]
}

interface Internship {
  id: string
  title: string
  department: string
  description: string
  location: string | null
  duration: string | null
  isOpen: boolean
  requirements: string | null
  _count: {
    applications: number
  }
}

const inputClass = "w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"

export default function ApplicationPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const internshipId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [internship, setInternship] = useState<Internship | null>(null)
  const [steps, setSteps] = useState<ApplicationStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreviewBanner, setShowPreviewBanner] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch internship
        const internshipRes = await fetch(`/api/internships/${internshipId}`)
        const internshipData = await internshipRes.json()
        
        if (internshipData.success) {
          setInternship(internshipData.internship)
        }
        
        // Fetch application steps
        const stepsRes = await fetch(`/api/internships/${internshipId}/steps`)
        const stepsData = await stepsRes.json()
        
        if (stepsData.success) {
          // Filter active steps and fields
          const activeSteps = stepsData.data
            .filter((s: ApplicationStep) => s.isActive)
            .map((s: ApplicationStep) => ({
              ...s,
              fields: s.fields.filter((f: ApplicationField) => f.isActive)
            }))
          setSteps(activeSteps)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [internshipId])
  
  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1
  
  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }
  
  const validateStep = (): boolean => {
    if (!currentStep) return true
    
    const newErrors: Record<string, string> = {}
    
    currentStep.fields.forEach(field => {
      if (field.isRequired) {
        const value = formData[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
      
      if (field.type === 'EMAIL' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address'
        }
      }
      
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep()) {
      alert('This is a preview. In the real application, this would submit the form.')
    }
  }
  
  const renderField = (field: ApplicationField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]
    const widthClass = field.width === 'full' ? 'col-span-full' : field.width === 'half' ? 'col-span-1' : 'col-span-1'
    
    if (field.type === 'HEADING') {
      return (
        <div key={field.id} className={`${widthClass} pt-4`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{field.label}</h3>
          {field.helpText && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{field.helpText}</p>}
        </div>
      )
    }
    
    if (field.type === 'PARAGRAPH') {
      return (
        <div key={field.id} className={widthClass}>
          <p className="text-slate-700 dark:text-slate-300">{field.label}</p>
          {field.helpText && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{field.helpText}</p>}
        </div>
      )
    }
    
    return (
      <div key={field.id} className={widthClass}>
        <label className={labelClass}>
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'TEXT' && (
          <input
            type="text"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={inputClass}
          />
        )}
        
        {field.type === 'TEXTAREA' && (
          <textarea
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
            className={inputClass}
          />
        )}
        
        {field.type === 'EMAIL' && (
          <input
            type="email"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || 'example@email.com'}
            className={inputClass}
          />
        )}
        
        {field.type === 'PHONE' && (
          <input
            type="tel"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || '+1 (555) 123-4567'}
            className={inputClass}
          />
        )}
        
        {field.type === 'URL' && (
          <input
            type="url"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || 'https://example.com'}
            className={inputClass}
          />
        )}
        
        {field.type === 'NUMBER' && (
          <input
            type="number"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={inputClass}
          />
        )}
        
        {field.type === 'DATE' && (
          <input
            type="date"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={inputClass}
          />
        )}
        
        {field.type === 'IMAGE' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
            <ImageUpload
              value={value}
              onChange={(url) => updateField(field.id, url)}
            />
            {field.helpText && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{field.helpText}</p>}
          </div>
        )}
        
        {field.type === 'PDF' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
            <PdfUpload
              value={value}
              onChange={(url: string | string[]) => updateField(field.id, url)}
            />
            {field.helpText && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{field.helpText}</p>}
          </div>
        )}
        
        {field.type === 'SELECT' && (
          <select
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={inputClass}
          >
            <option value="">Select an option...</option>
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        
        {field.type === 'MULTI_SELECT' && (
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700">
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
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
                  className="w-5 h-5 text-blue-600 rounded border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'RADIO' && (
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700">
            {field.options && JSON.parse(field.options).map((opt: string) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-5 h-5 text-blue-600 border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'CHECKBOX' && (
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateField(field.id, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300"
            />
            <span className="text-slate-700 dark:text-slate-300">{field.helpText || field.label}</span>
          </label>
        )}
        
        {field.helpText && !['CHECKBOX', 'IMAGE', 'PDF', 'HEADING', 'PARAGRAPH'].includes(field.type) && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{field.helpText}</p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading preview...</p>
        </div>
      </div>
    )
  }
  
  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Internship not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Preview Banner */}
      {showPreviewBanner && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">Preview Mode</span>
              <span className="hidden sm:inline text-amber-100">— This is how candidates will see the application form</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/internships/${internshipId}/apply-settings`}>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
              </Link>
              <button onClick={() => setShowPreviewBanner(false)} className="p-1 hover:bg-white/20 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header - Mimics what user sees */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                S
              </div>
              <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Stagi
              </span>
            </div>
            <Button variant="outline" className="border-slate-300 dark:border-slate-600 dark:text-slate-300" disabled>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <button 
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
          disabled
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        
        {/* Internship Header Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2" />
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {internship.title}
                  </CardTitle>
                  {internship.isOpen ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Closed
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {internship.department}
                  </span>
                  {internship.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {internship.location}
                    </span>
                  )}
                  {internship.duration && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {internship.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Application Form */}
        {steps.length === 0 ? (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Application Steps Configured</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Add application steps in the editor to see the preview.
            </p>
            <Link href={`/admin/internships/${internshipId}/apply-settings`}>
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Editor
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="text-xl text-slate-900 dark:text-white">Application Form</CardTitle>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                          ${idx < currentStepIndex ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 
                            idx === currentStepIndex ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg shadow-blue-500/30' : 
                            'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
                        `}>
                          {idx < currentStepIndex ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
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
                    {currentStep?.title}
                  </h2>
                  {currentStep?.description && (
                    <p className="text-slate-600 dark:text-slate-400">{currentStep.description}</p>
                  )}
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Step {currentStepIndex + 1} of {steps.length}
                  </p>
                </div>
              </div>
              
              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStep?.fields.map(renderField)}
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                  {currentStepIndex > 0 ? (
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="px-6 py-3 gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  ) : <div />}

                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 gap-2"
                    >
                      Submit Application
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* Progress Indicator */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          <p>💾 Your progress is automatically saved</p>
        </div>
      </div>
    </div>
  )
}
