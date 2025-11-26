import { create } from 'zustand'
import { ApplicationFormData } from '@/lib/types'

type ApplicationStep = 1 | 2 | 3

interface ApplicationStore {
  // Form state
  currentStep: ApplicationStep
  formData: Partial<ApplicationFormData>
  
  // Actions
  setStep: (step: ApplicationStep) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Partial<ApplicationFormData>) => void
  resetForm: () => void
  
  // Computed
  isStepValid: (step: ApplicationStep) => boolean
}

const initialFormData: Partial<ApplicationFormData> = {
  internshipId: '',
  resumeUrl: '',
  coverLetter: '',
  linkedinUrl: '',
  githubUrl: ''
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 3) as ApplicationStep
  })),
  
  previousStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1) as ApplicationStep
  })),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData
  }),
  
  isStepValid: (step) => {
    const { formData } = get()
    
    switch (step) {
      case 1:
        // Auth check is automatic
        return true
      case 2:
        // Profile info (optional fields for now)
        return true
      case 3:
        // Resume is required
        return !!formData.resumeUrl && formData.resumeUrl.length > 0
      default:
        return false
    }
  }
}))
