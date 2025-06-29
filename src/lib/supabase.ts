import { createClient } from '@supabase/supabase-js'

// Use fallback values if environment variables are not available (for production builds)
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://txhcadkcdvbwysrwpdvd.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aGNhZGtjZHZid3lzcndwZHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTM1MjksImV4cCI6MjA2NjcyOTUyOX0.qG8TNx76IwDn1TwKaG7dXc1rJGc1CwtzWqwJDbSq3Tw'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

console.log('🔧 Supabase configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  signInWithOAuth: async (provider: 'google' | 'github') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}