# How to Make a User Admin 👨‍💼

## Two Methods Available:

### Method 1: Interactive CLI (Recommended) ✨

This shows you all users and lets you select who to promote:

```powershell
$env:DATABASE_URL='postgresql://neondb_owner:npg_wkV5qMGrfZC9@ep-rough-dust-a449bgal-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require' ; npm run db:promote-admin
```

**What it does:**
1. Shows all users with their name, email, and current role
2. Lets you select a user by number
3. Asks for confirmation
4. Promotes them to ADMIN

**Example output:**
```
📋 Available Users:

  1. John Doe
     Email: john@example.com
     Role: CANDIDATE
     Joined: 11/23/2025

  2. Jane Smith
     Email: jane@example.com
     Role: ADMIN
     Joined: 11/22/2025

Enter the number of the user to make ADMIN (or "q" to quit):
```

---

### Method 2: Direct Email Command

If you know the user's email:

```powershell
$env:DATABASE_URL='postgresql://neondb_owner:npg_wkV5qMGrfZC9@ep-rough-dust-a449bgal-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require' ; npm run db:make-admin your-email@example.com
```

---

## Quick Steps:

1. **Make sure you have a user** - Sign up at http://localhost:3000/sign-up

2. **Visit dashboard** - Go to http://localhost:3000/dashboard (this syncs your Clerk user to the database)

3. **Run the interactive script**:
   ```powershell
   $env:DATABASE_URL='postgresql://neondb_owner:npg_wkV5qMGrfZC9@ep-rough-dust-a449bgal-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require' ; npm run db:promote-admin
   ```

4. **Select your user** by entering the number

5. **Confirm** by typing `yes`

6. **Done!** 🎉 You're now an admin

---

## Verify Admin Status

Visit http://localhost:3000/debug/users to see:
- All users in the database
- Their roles (ADMIN/CANDIDATE)
- User statistics

---

## What Admins Can Do (Coming Soon):

- ✅ View all applications
- ✅ Update application statuses
- ✅ Create/edit/close internship positions
- ✅ Manage users
- ✅ View analytics dashboard

---

## Troubleshooting:

**Problem:** "No users found"
**Solution:** Sign up first, then visit /dashboard to sync your user

**Problem:** Script won't run
**Solution:** Make sure the dev server isn't using the terminal. Open a new PowerShell window.

**Problem:** User not showing up
**Solution:** After signing up with Clerk, visit http://localhost:3000/dashboard once to trigger auto-sync
