# InternFlow Landing Page

## 🎨 Modern Landing Page Built with Next.js 16 + Tailwind CSS 4 + Shadcn/UI

A stunning, fully responsive landing page for the InternFlow internship management platform.

## ✨ Features

### Design & UX
- **Modern Gradient Hero** - Eye-catching hero section with animated gradients
- **Sticky Navigation** - Smart header that stays visible while scrolling
- **Mobile-First** - Fully responsive design that works on all devices
- **Dark Mode Ready** - Prepared for dark mode theme switching
- **Smooth Animations** - Hover effects and transitions for better UX

### Sections
1. **Hero Section** - Compelling headline with CTAs and key statistics
2. **Features Grid** - 9 feature cards showcasing platform benefits
3. **Open Positions** - Interactive job listings with filters
4. **Testimonials** - Social proof with user reviews and ratings
5. **Footer** - Comprehensive footer with links and social media

### Tech Stack
- ⚡ **Next.js 16** - Latest App Router with Turbopack
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🧩 **Shadcn/UI** - Beautiful, accessible component library
- 🎭 **Lucide Icons** - Modern icon library
- 📱 **Responsive** - Mobile, tablet, and desktop optimized

## 🚀 Getting Started

The development server is already running! Just open your browser:

```
http://localhost:3000
```

## 📁 Project Structure

```
stagi/
├── app/
│   ├── globals.css          # Global styles with CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main landing page
├── components/
│   ├── ui/                  # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/              # Layout components
│   │   ├── header.tsx       # Sticky navigation
│   │   └── footer.tsx       # Footer with links
│   └── sections/            # Page sections
│       ├── hero-section.tsx
│       ├── features-section.tsx
│       ├── open-positions-section.tsx
│       └── testimonials-section.tsx
└── lib/
    └── utils.ts             # Utility functions (cn helper)
```

## 🎨 Components Overview

### Header
- Sticky navigation with transparent backdrop blur
- Mobile hamburger menu
- Sign In / Get Started CTAs
- Smooth scroll to sections

### Hero Section
- Gradient background animations
- Bold headline with gradient text
- Two-column CTA buttons
- Statistics showcase (500+ startups, 2K+ interns)

### Features Section
- 3-column grid (responsive)
- 9 feature cards with icons
- Hover animations
- Color-coded icons

### Open Positions
- Job listing cards
- Department badges
- Location and duration info
- Skill tags
- "View Details" CTAs

### Testimonials
- User reviews with ratings
- Profile avatars
- Company logos
- 3-column grid layout

### Footer
- Multi-column layout
- Quick links (Students, Companies, Company)
- Social media icons
- Privacy & Terms links

## 🎨 Color Palette

The landing page uses a beautiful blue-to-purple gradient theme:

```css
Primary: Blue (#3B82F6)
Secondary: Purple (#9333EA)
Accent: Pink (#EC4899)
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Customization

### Changing Colors
Edit `app/globals.css` CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue */
  --secondary: 210 40% 96.1%;     /* Light gray */
  /* ... other variables */
}
```

### Adding New Sections
1. Create a new component in `components/sections/`
2. Import and add to `app/page.tsx`

### Modifying Content
- **Hero Text**: Edit `components/sections/hero-section.tsx`
- **Features**: Update the `features` array in `features-section.tsx`
- **Jobs**: Modify `mockInternships` array in `open-positions-section.tsx`
- **Testimonials**: Edit `testimonials` array in `testimonials-section.tsx`

## 🌐 Navigation Links

Current navigation structure:
- **Features** → `#features` (scroll to features section)
- **Open Positions** → `#positions` (scroll to positions section)
- **About** → `#about` (placeholder)
- **Contact** → `#contact` (placeholder)

## 📦 Installed Packages

```json
{
  "dependencies": {
    "next": "16.0.3",
    "react": "19.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "tailwind-merge": "^2.5.5"
  }
}
```

## 🎯 Next Steps

To complete the InternFlow platform, you'll need to:

1. **Set up Authentication** (Clerk)
   ```bash
   npm install @clerk/nextjs
   ```

2. **Add Database** (Prisma + Neon)
   ```bash
   npm install prisma @prisma/client
   npm install -D prisma
   ```

3. **Implement State Management** (React Query + Zustand)
   ```bash
   npm install @tanstack/react-query zustand
   ```

4. **Create Dynamic Pages**
   - `/internship/[id]` - Individual job details
   - `/dashboard` - Candidate dashboard
   - `/admin` - Admin panel
   - `/apply/[id]` - Application wizard

5. **Add File Upload** (UploadThing)
   ```bash
   npm install uploadthing @uploadthing/react
   ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Tailwind Not Working
Make sure `globals.css` is imported in `layout.tsx` and CSS variables are properly defined.

### Components Not Found
All component imports use the `@/` alias which points to the root directory.

## 📄 License

This project is part of the InternFlow platform specification.

## 🤝 Contributing

This is a template landing page. Customize it to match your startup's branding and content needs!

---

**Built with ❤️ using Next.js, Tailwind CSS, and Shadcn/UI**
