'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitApplication } from '@/app/actions/applications'
import { Button } from '@/components/ui/button'
import { FileUpload, ImageUpload } from '@/components/ui/file-upload'
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, User, FileText, GraduationCap, Briefcase, Sparkles } from 'lucide-react'
import type { InternshipWithCount } from '@/lib/types'

interface ApplicationFormProps {
  internship: InternshipWithCount
  isLoggedIn: boolean
}

// Input class for dark mode support
const inputClass = "w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
const textClass = "text-slate-600 dark:text-slate-400"

export default function ApplicationForm({ internship, isLoggedIn }: ApplicationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalSteps = 5
  
  const [formData, setFormData] = useState({
    phone: '',
    city: '',
    country: '',
    address: '',
    profilePhotoUrl: '',
    resumeUrl: '',
    additionalDocuments: [] as string[],
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    gpa: 0,
    skills: '',
    languages: '',
    coverLetter: '',
    availability: '',
    expectedSalary: ''
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const validateStep = (step: number): boolean => {
    setError(null)
    switch (step) {
      case 1:
        if (!formData.phone || !formData.city || !formData.country) {
          setError('Please fill in all required contact information')
          return false
        }
        return true
      case 2:
        if (!formData.resumeUrl) {
          setError('Please upload your resume')
          return false
        }
        return true
      case 3:
        if (!formData.university || !formData.major) {
          setError('Please fill in your education information')
          return false
        }
        return true
      case 4:
        if (!formData.skills) {
          setError('Please list your skills')
          return false
        }
        return true
      case 5:
        if (!formData.coverLetter || !formData.availability) {
          setError('Please complete your cover letter and availability')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep(currentStep - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    if (!isLoggedIn) {
      sessionStorage.setItem('pendingApplication', JSON.stringify({
        internshipId: internship.id,
        formData
      }))
      router.push(`/sign-in?redirect_url=/apply/${internship.id}`)
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitApplication({
        internshipId: internship.id,
        fullName: formData.phone ? 'User Name' : '',
        email: '',
        phone: formData.phone || '',
        education: `${formData.university || ''}, ${formData.major || ''}, GPA: ${formData.gpa || ''}`,
        experience: formData.skills || '',
        whyInterested: formData.coverLetter || '',
        availability: formData.availability || '',
        resumeUrl: formData.resumeUrl || undefined,
        coverLetter: formData.coverLetter || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
      })
      
      if (result.success) {
        router.push('/dashboard/applications?success=true')
      } else {
        setError(result.error || 'Failed to submit application')
        setIsSubmitting(false)
      }
    } catch {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: 'Contact Information', icon: User, emoji: '📞' },
    { id: 2, title: 'Resume & Documents', icon: FileText, emoji: '📄' },
    { id: 3, title: 'Education', icon: GraduationCap, emoji: '🎓' },
    { id: 4, title: 'Skills & Experience', icon: Briefcase, emoji: '💼' },
    { id: 5, title: 'Cover Letter & Final Details', icon: Sparkles, emoji: '✨' },
  ]
  
  return (
    <div className="space-y-10">
      {/* Progress Steps */}
      <div>
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                  ${step.id < currentStep ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 
                    step.id === currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg shadow-blue-500/30' : 
                    'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
                `}>
                  {step.id < currentStep ? <CheckCircle2 className="h-6 w-6" /> : step.id}
                </div>
                <p className={`text-xs mt-2 text-center hidden sm:block transition-colors duration-300 max-w-[80px] ${
                  step.id === currentStep ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {steps[currentStep - 1].title}
          </h2>
          <p className={textClass}>
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">📞</span>
              </div>
              <p className={textClass}>Let us know how to reach you</p>
            </div>
            
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center mb-8">
              <label className={`${labelClass} text-center`}>
                Profile Photo <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="w-full max-w-xs">
                <ImageUpload
                  value={formData.profilePhotoUrl}
                  onChange={(url) => setFormData({ ...formData, profilePhotoUrl: url as string })}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Upload a professional headshot</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="San Francisco"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="United States"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  Address <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="123 Main St"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Resume & Documents */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">📄</span>
              </div>
              <p className={textClass}>Upload your resume and share your professional profiles</p>
            </div>
            
            {/* Resume Upload */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700">
              <label className={`${labelClass} flex items-center gap-2`}>
                <FileText className="w-5 h-5 text-red-500" />
                Resume / CV <span className="text-red-500">*</span>
              </label>
              <FileUpload
                endpoint="resumeUploader"
                value={formData.resumeUrl}
                onChange={(url) => setFormData({ ...formData, resumeUrl: url as string })}
                accept="pdf"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                📎 Upload your resume in PDF format (max 8MB)
              </p>
            </div>

            {/* Additional Documents */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700">
              <label className={`${labelClass} flex items-center gap-2`}>
                <FileText className="w-5 h-5 text-blue-500" />
                Additional Documents <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
              </label>
              <FileUpload
                endpoint="applicationAttachment"
                value={formData.additionalDocuments}
                onChange={(urls) => setFormData({ ...formData, additionalDocuments: urls as string[] })}
                accept="both"
                multiple
                maxFiles={3}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                📎 Upload certificates, portfolio samples, or other relevant documents (up to 3 files)
              </p>
            </div>
            
            {/* Professional Links */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Professional Links</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className={labelClass}>GitHub</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="github.com/yourname"
                  />
                </div>
                <div>
                  <label className={labelClass}>Portfolio</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">🎓</span>
              </div>
              <p className={textClass}>Tell us about your educational background</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  University / Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Stanford University"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  Major / Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Expected Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className={inputClass}
                  min="2020"
                  max="2035"
                />
              </div>
              <div>
                <label className={labelClass}>GPA <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span></label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="4"
                  className={inputClass}
                  placeholder="3.75"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Skills & Experience */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">💼</span>
              </div>
              <p className={textClass}>Showcase your skills and abilities</p>
            </div>
            <div>
              <label className={labelClass}>
                Skills & Technologies <span className="text-red-500">*</span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows={5}
                className={inputClass}
                placeholder="List your technical skills, tools, and technologies you're proficient in...&#10;&#10;Example: Python, JavaScript, React, Node.js, SQL, Git, AWS, Docker..."
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                💡 Tip: Include both technical skills and soft skills relevant to the internship
              </p>
            </div>
            <div>
              <label className={labelClass}>Languages <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span></label>
              <textarea
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                rows={3}
                className={inputClass}
                placeholder="English (Native), Spanish (Fluent), Mandarin (Basic)..."
              />
            </div>
          </div>
        )}

        {/* Step 5: Cover Letter & Final Details */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">✨</span>
              </div>
              <p className={textClass}>Almost there! Tell us why you're perfect for this role</p>
            </div>
            <div>
              <label className={labelClass}>
                Cover Letter / Motivation <span className="text-red-500">*</span>
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={8}
                className={inputClass}
                placeholder="Tell us why you're interested in this internship and what makes you a great fit...&#10;&#10;Consider mentioning:&#10;• What attracted you to this opportunity&#10;• Relevant experience or projects&#10;• What you hope to learn or achieve"
                required
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Availability <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Immediately / Starting June 2025"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Expected Compensation <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="$50,000/year or Negotiable"
                />
              </div>
            </div>
            
            {!isLoggedIn && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">🔐 Almost Done!</p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">You'll be asked to sign in or create an account to submit your application</p>
              </div>
            )}
            
            {/* Application Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Application Summary
              </h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className={textClass}>Position:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{internship.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textClass}>Location:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{formData.city}, {formData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textClass}>Education:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{formData.university || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textClass}>Resume:</span>
                  <span className={`font-medium ${formData.resumeUrl ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formData.resumeUrl ? '✓ Uploaded' : '✗ Not uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t-2 border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center gap-2 ml-auto shadow-lg shadow-blue-500/30 transition-all"
            >
              Next Step
              <ChevronRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 ml-auto disabled:opacity-50 shadow-lg shadow-green-500/30 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {isLoggedIn ? 'Submit Application' : 'Sign In & Submit'}
                  <CheckCircle2 className="h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p>💾 Your progress is automatically saved</p>
      </div>
    </div>
  )
}
