import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { requireSupabase, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore the Supabase session:', error.message)
      if (mounted) {
        setSession(data?.session ?? null)
        setLoading(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signIn: async (email, password) => {
      const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },
    signOut: async () => {
      const { error } = await requireSupabase().auth.signOut()
      if (error) throw error
    },
  }), [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
