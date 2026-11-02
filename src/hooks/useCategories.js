import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { requireSupabase } from '../lib/supabaseClient'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await requireSupabase()
        .from('categories')
        .select('id, name, position')
        .order('position', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      setCategories(data ?? [])
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to load categories.', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { categories, loading, refresh }
}
