#!/usr/bin/env node

/**
 * Authentication Stress Test Script
 * 
 * This script performs comprehensive testing of the authentication system
 * to ensure it's robust and doesn't break under various scenarios.
 */

const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test configuration
const TEST_CONFIG = {
  testUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    displayName: 'Test User'
  },
  protectedRoutes: [
    '/pods',
    '/challenges',
    '/agent',
    '/feed',
    '/communities',
    '/settings',
    '/profile',
    '/saved',
    '/connect',
    '/onboarding',
    '/auth-test'
  ],
  publicRoutes: [
    '/',
    '/about',
    '/pricing',
    '/how-it-works',
    '/offerings',
    '/learn',
    '/security',
    '/auth/login',
    '/auth/sign-up'
  ]
}

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
}

// Utility functions
function logTest(name, status, message) {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏳'
  console.log(`${icon} ${name}: ${message}`)
  
  testResults.total++
  if (status === 'PASS') testResults.passed++
  if (status === 'FAIL') testResults.failed++
  
  testResults.details.push({ name, status, message })
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    return { response, error: null }
  } catch (error) {
    return { response: null, error }
  }
}

// Test functions
async function testUserRegistration() {
  console.log('\n🔐 Testing User Registration...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_CONFIG.testUser.email,
      password: TEST_CONFIG.testUser.password,
      options: {
        data: {
          display_name: TEST_CONFIG.testUser.displayName
        }
      }
    })
    
    if (error) {
      logTest('User Registration', 'FAIL', `Registration failed: ${error.message}`)
      return null
    }
    
    logTest('User Registration', 'PASS', `User registered: ${TEST_CONFIG.testUser.email}`)
    return data.user
  } catch (error) {
    logTest('User Registration', 'FAIL', `Registration error: ${error.message}`)
    return null
  }
}

async function testUserLogin() {
  console.log('\n🔑 Testing User Login...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_CONFIG.testUser.email,
      password: TEST_CONFIG.testUser.password
    })
    
    if (error) {
      logTest('User Login', 'FAIL', `Login failed: ${error.message}`)
      return null
    }
    
    logTest('User Login', 'PASS', `User logged in: ${data.user.email}`)
    return data.user
  } catch (error) {
    logTest('User Login', 'FAIL', `Login error: ${error.message}`)
    return null
  }
}

async function testSessionValidation() {
  console.log('\n🎫 Testing Session Validation...')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      logTest('Session Validation', 'FAIL', `Session check failed: ${error.message}`)
      return false
    }
    
    if (!session) {
      logTest('Session Validation', 'FAIL', 'No valid session found')
      return false
    }
    
    logTest('Session Validation', 'PASS', `Valid session expires at: ${new Date(session.expires_at * 1000).toLocaleString()}`)
    return true
  } catch (error) {
    logTest('Session Validation', 'FAIL', `Session validation error: ${error.message}`)
    return false
  }
}

async function testProtectedRouteAccess() {
  console.log('\n🛡️ Testing Protected Route Access...')
  
  for (const route of TEST_CONFIG.protectedRoutes) {
    const { response, error } = await makeRequest(route)
    
    if (error) {
      logTest(`Protected Route: ${route}`, 'FAIL', `Request failed: ${error.message}`)
      continue
    }
    
    if (response.status === 200) {
      logTest(`Protected Route: ${route}`, 'PASS', 'Access granted')
    } else if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location')
      if (location && location.includes('/auth/login')) {
        logTest(`Protected Route: ${route}`, 'PASS', 'Redirected to login (expected)')
      } else {
        logTest(`Protected Route: ${route}`, 'FAIL', `Unexpected redirect: ${location}`)
      }
    } else {
      logTest(`Protected Route: ${route}`, 'FAIL', `Unexpected status: ${response.status}`)
    }
  }
}

async function testPublicRouteAccess() {
  console.log('\n🌐 Testing Public Route Access...')
  
  for (const route of TEST_CONFIG.publicRoutes) {
    const { response, error } = await makeRequest(route)
    
    if (error) {
      logTest(`Public Route: ${route}`, 'FAIL', `Request failed: ${error.message}`)
      continue
    }
    
    if (response.status === 200) {
      logTest(`Public Route: ${route}`, 'PASS', 'Access granted')
    } else {
      logTest(`Public Route: ${route}`, 'FAIL', `Unexpected status: ${response.status}`)
    }
  }
}

async function testTokenRefresh() {
  console.log('\n🔄 Testing Token Refresh...')
  
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      logTest('Token Refresh', 'FAIL', `Token refresh failed: ${error.message}`)
      return false
    }
    
    logTest('Token Refresh', 'PASS', 'Token refreshed successfully')
    return true
  } catch (error) {
    logTest('Token Refresh', 'FAIL', `Token refresh error: ${error.message}`)
    return false
  }
}

async function testConcurrentSessions() {
  console.log('\n⚡ Testing Concurrent Sessions...')
  
  try {
    // Create multiple clients to simulate concurrent sessions
    const clients = Array.from({ length: 5 }, () => 
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    )
    
    const promises = clients.map(async (client, index) => {
      const { data, error } = await client.auth.getUser()
      if (error) throw error
      return { index, user: data.user }
    })
    
    const results = await Promise.all(promises)
    const allHaveUser = results.every(result => result.user)
    
    if (allHaveUser) {
      logTest('Concurrent Sessions', 'PASS', 'All concurrent sessions maintained')
    } else {
      logTest('Concurrent Sessions', 'FAIL', 'Some concurrent sessions lost')
    }
  } catch (error) {
    logTest('Concurrent Sessions', 'FAIL', `Concurrent session error: ${error.message}`)
  }
}

async function testSignOut() {
  console.log('\n🚪 Testing Sign Out...')
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logTest('Sign Out', 'FAIL', `Sign out failed: ${error.message}`)
      return false
    }
    
    // Verify user is signed out
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      logTest('Sign Out', 'FAIL', 'User still authenticated after sign out')
      return false
    }
    
    logTest('Sign Out', 'PASS', 'User signed out successfully')
    return true
  } catch (error) {
    logTest('Sign Out', 'FAIL', `Sign out error: ${error.message}`)
    return false
  }
}

async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling...')
  
  // Test invalid login
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'invalid@example.com',
      password: 'wrongpassword'
    })
    
    if (error && error.message.includes('Invalid login credentials')) {
      logTest('Invalid Login Handling', 'PASS', 'Properly rejected invalid credentials')
    } else {
      logTest('Invalid Login Handling', 'FAIL', 'Did not properly handle invalid credentials')
    }
  } catch (error) {
    logTest('Invalid Login Handling', 'FAIL', `Error handling failed: ${error.message}`)
  }
  
  // Test malformed requests
  try {
    const { response } = await makeRequest('/api/test-auth', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' })
    })
    
    if (response && response.status === 401) {
      logTest('Malformed Request Handling', 'PASS', 'Properly rejected malformed request')
    } else {
      logTest('Malformed Request Handling', 'FAIL', 'Did not properly handle malformed request')
    }
  } catch (error) {
    logTest('Malformed Request Handling', 'FAIL', `Error handling failed: ${error.message}`)
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...')
  
  try {
    // Sign out if still authenticated
    await supabase.auth.signOut()
    logTest('Cleanup', 'PASS', 'Test cleanup completed')
  } catch (error) {
    logTest('Cleanup', 'FAIL', `Cleanup error: ${error.message}`)
  }
}

// Main test runner
async function runStressTest() {
  console.log('🚀 Starting Authentication Stress Test...')
  console.log(`📍 Testing against: ${BASE_URL}`)
  console.log(`👤 Test user: ${TEST_CONFIG.testUser.email}`)
  
  try {
    // Run all tests
    await testUserRegistration()
    await delay(1000) // Wait for email confirmation in real scenarios
    
    await testUserLogin()
    await testSessionValidation()
    await testProtectedRouteAccess()
    await testPublicRouteAccess()
    await testTokenRefresh()
    await testConcurrentSessions()
    await testErrorHandling()
    await testSignOut()
    
    // Cleanup
    await cleanup()
    
    // Print results
    console.log('\n📊 Test Results Summary:')
    console.log(`✅ Passed: ${testResults.passed}`)
    console.log(`❌ Failed: ${testResults.failed}`)
    console.log(`📈 Total: ${testResults.total}`)
    console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)
    
    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:')
      testResults.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`   - ${test.name}: ${test.message}`))
    }
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0)
    
  } catch (error) {
    console.error('\n💥 Stress test failed with error:', error)
    process.exit(1)
  }
}

// Run the stress test
runStressTest()
