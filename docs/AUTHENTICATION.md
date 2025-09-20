# Authentication System Documentation

## Overview

The Percent Club platform implements a comprehensive, top-notch authentication system using Supabase Auth with Next.js middleware for route protection. The system ensures secure access to all protected routes while maintaining a smooth user experience.

## Architecture

### Components

1. **Middleware (`middleware.ts`)** - Main authentication gateway
2. **Supabase Middleware (`lib/supabase/middleware.ts`)** - Session management and route protection
3. **Auth Guard Component (`components/auth/auth-guard.tsx`)** - Client-side authentication wrapper
4. **Auth Pages** - Login, sign-up, error handling, and success pages
5. **Test Infrastructure** - Comprehensive testing and stress testing tools

## Protected Routes

The following routes require authentication:

- `/pods` - Savings pods management
- `/challenges` - Financial challenges
- `/agent` - Lonniee AI assistant
- `/feed` - Community feed
- `/communities` - Community management
- `/settings` - User settings
- `/profile` - User profiles
- `/saved` - Saved posts
- `/connect` - Bank connection
- `/onboarding` - User onboarding
- `/auth-test` - Authentication testing

## Public Routes

These routes are accessible without authentication:

- `/` - Landing page
- `/about` - About page
- `/pricing` - Pricing information
- `/how-it-works` - How it works page
- `/offerings` - Service offerings
- `/learn` - Learning resources
- `/security` - Security information
- `/auth/login` - Login page
- `/auth/sign-up` - Sign up page
- `/auth/sign-up-success` - Sign up success page
- `/auth/error` - Authentication error page
- `/clear-auth` - Clear authentication

## Authentication Flow

### 1. User Registration

```typescript
// User signs up with email and password
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    data: {
      display_name: 'User Name'
    }
  }
})
```

**Flow:**
1. User fills out sign-up form
2. Supabase sends verification email
3. User clicks verification link
4. Account is confirmed
5. User is redirected to `/connect` page

### 2. User Login

```typescript
// User logs in with credentials
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})
```

**Flow:**
1. User enters credentials
2. Supabase validates credentials
3. Session is created
4. User is redirected to intended page or `/connect`

### 3. Route Protection

The middleware automatically:
1. Checks for valid session on protected routes
2. Redirects unauthenticated users to `/auth/login`
3. Preserves intended destination in redirect parameter
4. Prevents authenticated users from accessing auth pages

### 4. Session Management

- **Automatic Refresh**: Sessions are automatically refreshed
- **Secure Storage**: Sessions stored in HTTP-only cookies
- **Cross-tab Sync**: Auth state syncs across browser tabs
- **Logout**: Complete session cleanup on sign out

## Security Features

### 1. Middleware Protection

```typescript
// Automatic route protection
const protectedRoutes = [
  "/pods", "/challenges", "/agent", "/feed",
  "/communities", "/settings", "/profile", 
  "/saved", "/connect", "/onboarding", "/auth-test"
]

// Redirect unauthenticated users
if (!user && isProtectedRoute) {
  const url = request.nextUrl.clone()
  url.pathname = "/auth/login"
  url.searchParams.set("redirect", request.nextUrl.pathname)
  return NextResponse.redirect(url)
}
```

### 2. Client-Side Guards

```typescript
// AuthGuard component for sensitive pages
<AuthGuard fallback={<LoadingSkeleton />}>
  <ProtectedContent />
</AuthGuard>
```

### 3. API Route Protection

```typescript
// Server-side authentication check
const { data: { user }, error } = await supabase.auth.getUser()

if (error || !user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  )
}
```

### 4. Error Handling

- **Invalid Credentials**: Clear error messages
- **Network Issues**: Graceful fallbacks
- **Session Expiry**: Automatic re-authentication
- **Malformed Requests**: Proper validation

## Testing Infrastructure

### 1. Auth Test Page (`/auth-test`)

Interactive testing interface that verifies:
- User authentication status
- Session validity and expiration
- Protected route access
- Token refresh capability
- Sign out functionality

### 2. Stress Test Script (`scripts/auth-stress-test.js`)

Comprehensive automated testing:

```bash
# Run stress test
node scripts/auth-stress-test.js
```

**Tests Include:**
- User registration and login
- Session validation
- Protected route access
- Public route access
- Token refresh
- Concurrent sessions
- Error handling
- Sign out functionality

### 3. API Test Endpoint (`/api/test-auth`)

Protected API route for testing authentication:

```typescript
// Test protected API access
const response = await fetch('/api/test-auth')
// Returns user data if authenticated, 401 if not
```

## Error Scenarios & Handling

### 1. Authentication Errors

| Error | Cause | Handling |
|-------|-------|----------|
| `access_denied` | User cancelled auth | Redirect to login with message |
| `server_error` | Supabase server issue | Show retry option |
| `temporarily_unavailable` | Service down | Show maintenance message |
| `invalid_request` | Malformed request | Clear form and retry |

### 2. Network Issues

- **Connection Timeout**: Retry with exponential backoff
- **Network Unavailable**: Show offline message
- **Rate Limiting**: Implement request queuing

### 3. Session Issues

- **Expired Session**: Automatic refresh attempt
- **Invalid Session**: Clear cookies and redirect
- **Concurrent Logout**: Sync across tabs

## Performance Considerations

### 1. Middleware Optimization

- **Selective Matching**: Only run on relevant routes
- **Caching**: Session validation caching
- **Early Returns**: Quick public route bypass

### 2. Client-Side Optimization

- **Lazy Loading**: Auth state loaded on demand
- **Debouncing**: Prevent multiple auth checks
- **Memoization**: Cache auth state results

### 3. Database Optimization

- **Indexed Queries**: Fast user lookups
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimal data transfer

## Monitoring & Logging

### 1. Development Logging

```typescript
// Detailed auth flow logging in development
if (!isProd) {
  console.log(`[Supabase Middleware] User check for ${request.nextUrl.pathname}:`, 
    user ? 'authenticated' : 'not authenticated')
}
```

### 2. Error Tracking

- **Client Errors**: Console logging with context
- **Server Errors**: Structured error logging
- **Auth Failures**: Detailed failure analysis

### 3. Performance Metrics

- **Auth Response Time**: Track authentication speed
- **Session Duration**: Monitor session longevity
- **Error Rates**: Track authentication success rates

## Deployment Considerations

### 1. Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=your_redirect_url
```

### 2. Production Settings

- **HTTPS Only**: Secure cookie transmission
- **SameSite Cookies**: CSRF protection
- **Secure Headers**: Additional security headers
- **Rate Limiting**: Prevent brute force attacks

### 3. Monitoring

- **Uptime Monitoring**: Track authentication service availability
- **Error Alerts**: Immediate notification of auth failures
- **Performance Monitoring**: Track response times

## Troubleshooting

### Common Issues

1. **"User not authenticated" errors**
   - Check session validity
   - Verify cookie settings
   - Clear browser cache

2. **Redirect loops**
   - Verify middleware configuration
   - Check route definitions
   - Validate redirect URLs

3. **Session not persisting**
   - Check cookie domain settings
   - Verify HTTPS configuration
   - Test cross-tab functionality

### Debug Tools

1. **Auth Test Page**: `/auth-test`
2. **Browser DevTools**: Network and Application tabs
3. **Supabase Dashboard**: Real-time auth monitoring
4. **Stress Test Script**: Automated testing

## Best Practices

### 1. Security

- **Strong Passwords**: Enforce password complexity
- **Rate Limiting**: Prevent brute force attacks
- **Session Timeout**: Automatic session expiration
- **HTTPS Only**: Secure data transmission

### 2. User Experience

- **Clear Error Messages**: Helpful error descriptions
- **Loading States**: Show authentication progress
- **Remember Me**: Optional persistent sessions
- **Quick Access**: Minimize authentication friction

### 3. Development

- **Type Safety**: Use TypeScript for auth types
- **Error Boundaries**: Graceful error handling
- **Testing**: Comprehensive test coverage
- **Documentation**: Keep docs updated

## Future Enhancements

### Planned Features

1. **Social Login**: Google, GitHub, Apple
2. **Two-Factor Authentication**: SMS, TOTP
3. **Passwordless Login**: Magic links, biometrics
4. **Advanced Security**: Device tracking, anomaly detection

### Performance Improvements

1. **Edge Caching**: Faster auth checks
2. **Preloading**: Anticipate auth needs
3. **Optimistic Updates**: Immediate UI feedback
4. **Background Refresh**: Seamless session renewal

---

This authentication system provides enterprise-grade security while maintaining excellent user experience. The comprehensive testing infrastructure ensures reliability and the modular architecture allows for easy maintenance and future enhancements.
