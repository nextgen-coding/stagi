# User Management Setup Complete ✅

## Issue Fixed
**Problem**: Users signing up with Clerk were not being synced to the database (users count was 0).

**Solution**: Created automatic user sync that happens when users visit protected pages.

---

## What Was Added

### 1. User Sync Action (`app/actions/users.ts`)
- `syncUser()` - Automatically creates user in database from Clerk data
- `getCurrentUser()` - Gets current user and syncs if needed
- `updateUserRole()` - Updates user role (ADMIN/CANDIDATE)

### 2. Dashboard Auto-Sync
The dashboard now automatically syncs users when they visit:
```typescript
// In app/dashboard/page.tsx
await syncUser()
```

### 3. Admin Management Script
**Make any user an admin** by running:
```bash
npm run db:make-admin your-email@example.com
```

The script will:
- Find the user by email
- Update their role to ADMIN
- Show all available users if email not found

### 4. User Debug Page
Visit **http://localhost:3000/debug/users** to:
- View all registered users
- See their roles (ADMIN/CANDIDATE)
- View user statistics
- Get instructions for making users admins

---

## How To Use

### Step 1: Sign Up
1. Go to http://localhost:3000/sign-up
2. Create your account with Clerk
3. You'll be redirected to the dashboard

### Step 2: Sync to Database
- When you visit `/dashboard`, you'll automatically be synced to the database
- Your user will be created with role: `CANDIDATE`

### Step 3: Make User Admin
Open a new terminal and run:
```powershell
$env:DATABASE_URL='postgresql://neondb_owner:npg_wkV5qMGrfZC9@ep-rough-dust-a449bgal-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require' ; npm run db:make-admin ouederni.dev@gmail.com
```

Replace `ouederni.dev@gmail.com` with your actual email.

### Step 4: Verify
Visit http://localhost:3000/debug/users to confirm:
- Your user appears in the list
- Your role shows as ADMIN

---

## For Your Specific Case

Since you want to make `ouedernidev` user an admin:

1. **First, sign up** at http://localhost:3000/sign-up with your email (ouederni.dev@gmail.com or similar)

2. **Visit dashboard** to trigger sync: http://localhost:3000/dashboard

3. **Run the admin command**:
```powershell
$env:DATABASE_URL='postgresql://neondb_owner:npg_wkV5qMGrfZC9@ep-rough-dust-a449bgal-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require' ; npm run db:make-admin your-actual-email@example.com
```

4. **Verify** at http://localhost:3000/debug/users

---

## Available Commands

```bash
# Seed sample internships
npm run db:seed

# Make a user admin
npm run db:make-admin <email>

# Open Prisma Studio
npx prisma studio
```

---

## Next Steps

Now that user management is working:
1. ✅ Users auto-sync from Clerk
2. ✅ Can promote users to admin
3. ⏭️ Build admin dashboard for managing applications
4. ⏭️ Create application submission form
5. ⏭️ Add file upload for resumes

---

## Important Files

- `app/actions/users.ts` - User sync and management actions
- `app/dashboard/page.tsx` - Auto-syncs users on visit
- `app/debug/users/page.tsx` - User management debug page
- `scripts/make-admin.ts` - CLI script to promote users
- `package.json` - Added `db:make-admin` script

---

## Database Stats

After seeding:
- 🎯 **10 sample internships** created across 8 departments
- 👤 **Users**: Auto-created when signing up with Clerk
- 📋 **Applications**: Ready to be submitted by candidates

Visit http://localhost:3000/internships to see all available positions!
