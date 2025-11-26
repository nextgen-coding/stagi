# OAuth Redirect Fix

## Problem
OAuth users (Google/GitHub sign-ins) weren't being redirected to the application form after signing in.

## Root Cause
1. The `pendingApplicationId` localStorage value wasn't being checked when OAuth redirect was initiated
2. The redirect priority in sso-callback wasn't optimal - it checked `redirectAfterAuth` before `applyToInternshipId`

## Changes Made

### 1. Sign-In Page (`app/(auth)/sign-in/[[...sign-in]]/page.tsx`)
- Updated `handleOAuthSignIn` to check for `pendingApplicationId` in localStorage as a fallback
- If no `redirectUrl` parameter exists but `pendingApplicationId` is present, it saves it as `applyToInternshipId` before OAuth redirect

### 2. Sign-Up Page (`app/(auth)/sign-up/[[...sign-up]]/page.tsx`)
- Updated `handleOAuthSignUp` with the same logic as sign-in
- Ensures `pendingApplicationId` is preserved during OAuth flow

### 3. SSO Callback Page (`app/sso-callback/page.tsx`)
- **Changed redirect priority**: Now checks `applyToInternshipId` FIRST (highest priority)
- Added cleanup of multiple localStorage keys to prevent stale data
- Added `pendingApplicationId` as a fallback option
- Changed from `window.location.href` to `router.push` for better client-side routing
- Added `router` to the useEffect dependency array

## Flow After Fix

### For Users Applying to Internships:
1. User clicks "Apply" on an internship
2. System saves internship ID to localStorage as `pendingApplicationId`
3. User is redirected to sign-in/sign-up with `?redirect=/apply/{id}` parameter
4. User clicks Google or GitHub OAuth button
5. OAuth handler saves both `redirectAfterAuth` AND `applyToInternshipId`
6. After OAuth completes, user is redirected to `/sso-callback`
7. SSO callback checks localStorage and redirects to `/apply/{id}` (highest priority)
8. User lands on the application form for that internship

### Priority Order in SSO Callback:
1. `applyToInternshipId` → `/apply/{id}`
2. `redirectAfterAuth` → custom redirect URL
3. `pendingApplicationId` → `/apply/{id}` (fallback)
4. Default → `/dashboard`

## Testing Recommendations
1. Test Google OAuth from application form
2. Test GitHub OAuth from application form
3. Test OAuth from regular sign-in (should go to dashboard)
4. Verify localStorage is cleaned up after redirect
5. Test with and without the `?redirect=` parameter
