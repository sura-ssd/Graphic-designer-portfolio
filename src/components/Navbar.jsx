import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/works', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand-mark" to="/" onClick={() => setOpen(false)} aria-label="Hermela Bereket home">
          <span>HB</span><i aria-hidden="true">.</i>
        </Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`menu-lines ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
        <div id="primary-navigation" className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
          <Link className="nav-cta" to="/contact" onClick={() => setOpen(false)}>Let&apos;s talk <span aria-hidden="true">↗</span></Link>
        </div>
      </nav>
    </header>
  )
}
