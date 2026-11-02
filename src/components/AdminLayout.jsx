import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from './ToastProvider'

export default function AdminLayout({ children, title, action }) {
  const { signOut, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to log out.', 'error')
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand-mark admin-brand" aria-label="Portfolio home"><span>HB</span><i>.</i></Link>
        <div className="admin-side-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <NavLink end to="/admin" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}><span aria-hidden="true">▦</span> Projects</NavLink>
          <NavLink to="/admin/messages" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}><span aria-hidden="true">✉</span> Messages</NavLink>
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-user">{user?.email}</span>
          <button type="button" className="admin-logout" onClick={handleLogout}>Log out <span aria-hidden="true">↗</span></button>
          <Link to="/" className="back-to-site">← View portfolio</Link>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><span>Hermela Bereket <span>/</span> Studio</span><span className="admin-topbar-status"><i /> Admin space</span></header>
        <div className="admin-content">
          <div className="admin-heading"><div><span className="eyebrow">Your creative space</span><h1>{title}</h1></div>{action}</div>
          {children}
        </div>
      </main>
    </div>
  )
}
