import { NotificationsDataTable, Notification } from '@/components/admin/notifications-data-table'

// Mock notifications data - in production this would come from database
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Application Received',
    message: 'John Doe applied for Software Engineering Intern position',
    type: 'application',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    link: '/admin/applications',
  },
  {
    id: '2',
    title: 'Application Status Updated',
    message: 'Sarah Wilson\'s application has been moved to reviewing',
    type: 'application',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: '/admin/applications',
  },
  {
    id: '3',
    title: 'Intern Started Learning Path',
    message: 'Michael Chen has started the Web Development learning path',
    type: 'learning',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    link: '/admin/progress',
  },
  {
    id: '4',
    title: 'Learning Path Completed',
    message: 'Emily Brown has completed the React Basics learning path',
    type: 'learning',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: '/admin/progress',
  },
  {
    id: '5',
    title: 'New Internship Posted',
    message: 'Data Science Intern position is now live',
    type: 'internship',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    link: '/admin/internships',
  },
  {
    id: '6',
    title: 'New Application Received',
    message: 'Alex Johnson applied for Data Science Intern position',
    type: 'application',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    link: '/admin/applications',
  },
  {
    id: '7',
    title: 'New User Registered',
    message: 'David Lee has created an account',
    type: 'user',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    link: '/admin/users',
  },
  {
    id: '8',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: '9',
    title: 'Module Progress Update',
    message: 'Lisa Wang is 75% through the Python Basics module',
    type: 'learning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    link: '/admin/progress',
  },
  {
    id: '10',
    title: 'New Intern Added',
    message: 'James Smith has been converted to intern status',
    type: 'user',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: '/admin/users',
  },
]

export default function NotificationsPage() {
  return <NotificationsDataTable data={mockNotifications} />
}
