#!/usr/bin/env node

// Simple script to check if Supabase environment variables are configured
// Run with: node scripts/check-supabase.js

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Supabase Configuration...\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  console.log('   Please add it to your .env.local file');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is configured');
  console.log(`   URL: ${supabaseUrl}`);
}

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  console.log('   Please add it to your .env.local file');
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured');
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
}

if (supabaseUrl && supabaseKey) {
  console.log('\n🎉 Supabase configuration looks good!');
  console.log('   Your middleware should now properly protect routes.');
} else {
  console.log('\n⚠️  Please fix the missing environment variables and restart your dev server.');
}
