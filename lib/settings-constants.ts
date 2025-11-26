// Constants for settings - separated from server actions for client-side use

export const DEPARTMENT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Slate', value: '#64748B' }
] as const

export const DEPARTMENT_ICONS = [
  'Briefcase',
  'Code',
  'Palette',
  'Database',
  'Server',
  'Smartphone',
  'LineChart',
  'Users',
  'Settings',
  'Globe',
  'Lightbulb',
  'Building2'
] as const
