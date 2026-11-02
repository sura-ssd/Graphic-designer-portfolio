import { useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { usePageMeta } from '../lib/seo'
import { requireSupabase } from '../lib/supabaseClient'

const socials = [
  { label: 'Behance', href: 'https://www.behance.net/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Email', href: 'mailto:?subject=Hello%20Hermela' },
]

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  usePageMeta('Contact', 'Have a project in mind? Send a note to Hermela Bereket about your design project.')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast('Please complete each field before sending.', 'error')
      return
    }
    setSending(true)
    try {
      const { error } = await requireSupabase().from('messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      if (error) throw error
      setForm({ name: '', email: '', message: '' })
      toast('Your message is on its way. Thank you!')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Your message could not be sent. Please try again.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section-wrap page-section contact-page">
      <div className="page-heading">
        <span className="eyebrow">A good place to start</span>
        <h1>Let&apos;s make<br /><em>something matter.</em></h1>
        <p>Have a project, a question, or just want to say hello? I&apos;d love to hear from you.</p>
      </div>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your name<input name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>A little about your project<textarea name="message" rows="5" required maxLength={5000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
          <button className="button button-dark" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send your message'} <span aria-hidden="true">↗</span></button>
        </form>
        <aside className="contact-aside">
          <div><span className="eyebrow">Find me around</span><div className="social-list">{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}<span aria-hidden="true">↗</span></a>)}</div></div>
          <div><span className="eyebrow">A note for now</span><p>I&apos;m currently open to thoughtful collaborations and new creative projects.</p></div>
        </aside>
      </div>
    </section>
  )
}
