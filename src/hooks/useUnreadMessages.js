import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { requireSupabase } from '../lib/supabaseClient'

const REFRESH_EVENT = 'admin-unread-messages-changed'
const REFRESH_INTERVAL_MS = 60 * 1000

export function notifyUnreadMessagesChanged() {
  window.dispatchEvent(new Event(REFRESH_EVENT))
}

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0)
  const toast = useToast()

  const refresh = useCallback(async () => {
    try {
      const { count, error } = await requireSupabase()
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false)
      if (error) throw error
      setUnreadCount(count ?? 0)
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to load unread message count.', 'error')
    }
  }, [toast])

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS)
    window.addEventListener('focus', refresh)
    window.addEventListener(REFRESH_EVENT, refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      window.removeEventListener(REFRESH_EVENT, refresh)
    }
  }, [refresh])

  return unreadCount
}
