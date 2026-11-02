import { useCallback, useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { useToast } from '../../components/ToastProvider'
import { requireSupabase } from '../../lib/supabaseClient'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await requireSupabase().from('messages').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data ?? [])
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to load messages.', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { refresh() }, [refresh])

  const updateMessage = async (message, updates) => {
    try {
      const { error } = await requireSupabase().from('messages').update(updates).eq('id', message.id)
      if (error) throw error
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, ...updates } : item))
      toast(updates.is_read ? 'Marked as read.' : 'Marked as unread.')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to update this message.', 'error')
    }
  }

  const deleteMessage = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return
    try {
      const { error } = await requireSupabase().from('messages').delete().eq('id', message.id)
      if (error) throw error
      setMessages((current) => current.filter((item) => item.id !== message.id))
      toast('Message deleted.')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to delete this message.', 'error')
    }
  }

  const unreadCount = messages.filter((message) => !message.is_read).length
  return (
    <AdminLayout title="Messages">
      <div className="admin-stats"><div><span>All messages</span><strong>{loading ? '—' : messages.length}</strong></div><div><span>Unread</span><strong>{loading ? '—' : unreadCount}</strong></div><div><span>Latest message</span><strong>{messages[0] ? new Date(messages[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</strong></div></div>
      <section className="admin-panel messages-panel">
        <div className="panel-heading"><div><h2>Your inbox</h2><p>Notes from people who found their way here.</p></div><span>{unreadCount} unread</span></div>
        {loading ? <div className="admin-loading" role="status">Loading messages…</div> : messages.length ? (
          <div className="message-list">{messages.map((message) => (
            <article key={message.id} className={`message-card ${message.is_read ? 'read' : ''}`}>
              <div className="message-meta"><span className={`read-indicator ${message.is_read ? 'is-read' : ''}`}>{message.is_read ? 'Read' : 'Unread'}</span><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</time></div>
              <h3>{message.name}</h3>
              <a className="message-email" href={`mailto:${message.email}`}>{message.email}</a>
              <p>{message.message}</p>
              <div className="message-actions"><a className="button button-small button-outline" href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your portfolio message')}`}>Reply <span aria-hidden="true">↗</span></a><button type="button" onClick={() => updateMessage(message, { is_read: !message.is_read })}>{message.is_read ? 'Mark unread' : 'Mark read'}</button><button type="button" onClick={() => deleteMessage(message)}>Delete</button></div>
            </article>
          ))}</div>
        ) : <div className="admin-empty"><span className="eyebrow">Room to connect</span><h2>Your inbox is quiet.</h2><p>New contact form messages will show up here.</p></div>}
      </section>
    </AdminLayout>
  )
}
