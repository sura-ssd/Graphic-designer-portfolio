import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { requireSupabase } from '../lib/supabaseClient'

export function useWorks({ featuredOnly = false, limit } = {}) {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const toast = useToast()
  const inFlight = useRef(null)

  const refresh = useCallback(() => {
    if (inFlight.current) return inFlight.current
    setLoading(true)
    setError('')
    const request = Promise.resolve().then(async () => {
      try {
        let query = requireSupabase().from('works').select('*').order('created_at', { ascending: false })
        if (featuredOnly) query = query.eq('featured', true)
        if (limit) query = query.limit(limit)
        const { data, error: requestError } = await query
        if (requestError) throw requestError
        setWorks(data ?? [])
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : 'Unable to load portfolio work.'
        setError(message)
        toast(message, 'error')
      } finally {
        setLoading(false)
      }
    }).finally(() => {
      if (inFlight.current === request) inFlight.current = null
    })
    inFlight.current = request
    return request
  }, [featuredOnly, limit, toast])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { works, loading, error, refresh }
}
