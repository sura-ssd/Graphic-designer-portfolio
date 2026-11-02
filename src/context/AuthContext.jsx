import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../components/ToastProvider'
import { requireSupabase, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)
const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000
const ACTIVITY_STORAGE_PREFIX = 'hermela-admin-activity:'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

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
      if (_event === 'SIGNED_IN' && nextSession?.user.id) {
        try {
          window.localStorage.setItem(`${ACTIVITY_STORAGE_PREFIX}${nextSession.user.id}`, String(Date.now()))
        } catch (error) {
          console.warn('Unable to initialize the admin activity timer:', error)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = session?.user.id
    if (!userId || !pathname.startsWith('/admin') || pathname === '/admin/login') return undefined

    const activityKey = `${ACTIVITY_STORAGE_PREFIX}${userId}`
    let lastActivityAt
    try {
      lastActivityAt = Number(window.localStorage.getItem(activityKey))
    } catch (error) {
      console.error('Unable to read the admin activity timer:', error)
      lastActivityAt = 0
    }
    if (!Number.isFinite(lastActivityAt) || lastActivityAt <= 0) {
      lastActivityAt = Date.now()
      try {
        window.localStorage.setItem(activityKey, String(lastActivityAt))
      } catch (error) {
        console.warn('Unable to persist the admin activity timer:', error)
      }
    }

    let lastPersistedAt = lastActivityAt
    let endingSession = false
    let mounted = true

    const handleActivity = () => {
      const now = Date.now()
      lastActivityAt = now
      if (now - lastPersistedAt < 2000) return
      lastPersistedAt = now
      try {
        window.localStorage.setItem(activityKey, String(now))
      } catch (error) {
        console.warn('Unable to persist the admin activity timer:', error)
      }
    }

    const handleStorage = (event) => {
      if (event.key !== activityKey) return
      const sharedActivityAt = Number(event.newValue)
      if (Number.isFinite(sharedActivityAt) && sharedActivityAt > lastActivityAt) {
        lastActivityAt = sharedActivityAt
      }
    }

    const checkInactivity = async () => {
      if (endingSession || Date.now() - lastActivityAt < INACTIVITY_TIMEOUT_MS) return
      endingSession = true

      try {
        const { error } = await requireSupabase().auth.signOut({ scope: 'local' })
        if (error) throw error
        if (!mounted) return
        window.localStorage.removeItem(activityKey)
        toast('You were signed out after 20 minutes of inactivity.')
        navigate('/admin/login', { replace: true })
      } catch (error) {
        if (!mounted) return
        console.error('Unable to end the inactive admin session:', error)
        try {
          window.localStorage.removeItem(activityKey)
        } catch (storageError) {
          console.warn('Unable to clear the admin activity timer:', storageError)
        }
        toast(error instanceof Error ? `Automatic sign-out failed: ${error.message}` : 'Automatic sign-out failed. Please sign out manually.', 'error')
        setSession(null)
        navigate('/admin/login', { replace: true })
      }
    }

    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'wheel']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }))
    window.addEventListener('storage', handleStorage)
    const timer = window.setInterval(checkInactivity, 1000)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkInactivity()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      mounted = false
      window.clearInterval(timer)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity))
      window.removeEventListener('storage', handleStorage)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (lastActivityAt > lastPersistedAt) {
        try {
          window.localStorage.setItem(activityKey, String(lastActivityAt))
        } catch (error) {
          console.warn('Unable to persist the admin activity timer:', error)
        }
      }
    }
  }, [session?.user.id, pathname, navigate, toast])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signIn: async (email, password) => {
      const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user?.id) {
        try {
          window.localStorage.setItem(`${ACTIVITY_STORAGE_PREFIX}${data.user.id}`, String(Date.now()))
        } catch (storageError) {
          console.warn('Unable to initialize the admin activity timer:', storageError)
        }
      }
      return data
    },
    signOut: async () => {
      const { error } = await requireSupabase().auth.signOut()
      if (error) throw error
      const userId = session?.user.id
      if (userId) {
        try {
          window.localStorage.removeItem(`${ACTIVITY_STORAGE_PREFIX}${userId}`)
        } catch (storageError) {
          console.warn('Unable to clear the admin activity timer:', storageError)
        }
      }
    },
  }), [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
