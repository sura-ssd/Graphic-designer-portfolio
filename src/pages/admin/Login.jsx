import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ToastProvider'
import { usePageMeta } from '../../lib/seo'

export default function Login() {
  const { signIn, user, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  usePageMeta('Admin Sign In', 'Sign in to the Hermela Bereket portfolio admin dashboard.')

  if (!loading && user) return <Navigate to="/admin" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      toast('Welcome back.')
      navigate('/admin', { replace: true })
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to sign in. Check your credentials and try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="brand-mark login-brand" aria-label="Back to portfolio"><span>HB</span><i>.</i></Link>
      <div className="login-card">
        <span className="eyebrow">Private studio</span>
        <h1>Welcome <em>back.</em></h1>
        <p>Sign in to keep your portfolio up to date.</p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="button button-dark button-full" disabled={submitting || loading}>{submitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">↗</span></button>
        </form>
        <Link className="login-back-link" to="/">← Back to portfolio</Link>
      </div>
      <span className="login-footnote">Hermela Bereket · Admin</span>
    </main>
  )
}
