<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
</p>

<h1 align="center">🎓 Stagi</h1>

<p align="center">
  <strong>A modern, full-featured internship management platform</strong>
</p>

<p align="center">
  Streamline your internship program with a beautiful, intuitive platform for managing applications, tracking progress, and guiding interns through their learning journey.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## ✨ Features

### 🏠 Modern Landing Page
- **Hero Section** - Eye-catching gradient design with call-to-action
- **Features Showcase** - Highlight platform capabilities
- **Open Positions** - Dynamic display of available internships
- **Testimonials** - Social proof from past interns
- **Responsive Design** - Beautiful on all devices

### 👤 Candidate Portal
- **Smart Dashboard** - Track applications with real-time status updates
- **Internship Browser** - Filter by department, search positions
- **One-Click Apply** - Streamlined multi-step application process
- **Learning Paths** - Guided learning modules with progress tracking
- **Profile Settings** - Manage preferences and notifications

### 🛡️ Admin Dashboard
- **User Management** - View, edit, and manage all users
- **Internship Management** - Create, edit, and publish positions
- **Application Review** - Process applications with status workflow
- **Learning Path Builder** - Create modules and tasks with rich content
- **Analytics Overview** - Track platform statistics

### 🔐 Authentication & Security
- **Clerk Integration** - Enterprise-grade authentication
- **OAuth Providers** - Google & GitHub sign-in
- **Role-Based Access** - Admin, Candidate roles
- **Protected Routes** - Middleware-enforced security
- **Session Management** - Secure user sessions

### 📚 Learning Management
- **Learning Paths** - Structured educational content
- **Modules & Tasks** - Organized curriculum
- **Rich Content Editor** - Markdown & HTML support
- **Progress Tracking** - Monitor completion status
- **File Attachments** - UploadThing integration

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| **ORM** | [Prisma 5](https://www.prisma.io/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) + [React Query](https://tanstack.com/query) |
| **File Uploads** | [UploadThing](https://uploadthing.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (or [Neon](https://neon.tech/) account)
- [Clerk](https://clerk.com/) account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nextgen-coding/stagi.git
   cd stagi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Clerk Routes
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   
   # UploadThing (for file uploads)
   UPLOADTHING_TOKEN=...
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
stagi/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin routes (protected)
│   │   └── admin/           # Admin dashboard pages
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/         # Sign in page
│   │   └── sign-up/         # Sign up page
│   ├── (dashboard)/         # User dashboard (protected)
│   │   └── dashboard/       # Dashboard pages
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   ├── internships/         # Public internship pages
│   └── apply/               # Application flow
├── components/              # React components
│   ├── admin/               # Admin-specific components
│   ├── layout/              # Layout components
│   ├── sections/            # Landing page sections
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── prisma/                  # Database schema & seeds
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── stores/                  # Zustand stores
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the database |
| `npm run db:make-admin` | Create admin user |
| `npm run db:promote-admin` | Promote user to admin |

---

## 🗄️ Database Schema

### Core Models

```prisma
model User {
  id           String        @id @default(uuid())
  clerkId      String        @unique
  email        String        @unique
  firstName    String?
  lastName     String?
  role         UserRole      @default(CANDIDATE)
  applications Application[]
  progress     UserProgress[]
}

model Internship {
  id           String        @id @default(uuid())
  title        String
  department   String
  location     String
  duration     String
  description  String
  requirements String[]
  status       InternshipStatus
  applications Application[]
}

model Application {
  id           String            @id @default(uuid())
  userId       String
  internshipId String
  status       ApplicationStatus
  appliedAt    DateTime
  user         User              @relation(...)
  internship   Internship        @relation(...)
}

model LearningPath {
  id          String   @id @default(uuid())
  title       String
  description String
  modules     Module[]
}
```

---

## 🎨 UI/UX Features

- **Dark Mode Support** - System preference detection + manual toggle
- **Glassmorphism Design** - Modern frosted glass effects
- **Responsive Layout** - Mobile-first approach
- **Smooth Animations** - Subtle transitions and hover effects
- **Accessible** - ARIA labels and keyboard navigation
- **Blue/Cyan Theme** - Professional gradient color scheme

---

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable Email and OAuth providers (Google, GitHub)
3. Configure redirect URLs in Clerk dashboard
4. Add environment variables to `.env.local`

### Database Setup (Neon)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Add to `DATABASE_URL` in `.env.local`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by [NextGen Coding](https://github.com/nextgen-coding)

---

<p align="center">
  <strong>⭐ Star this repo if you find it helpful!</strong>
</p>
