import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <span className="eyebrow">Have a good one in mind?</span>
          <h2>Let&apos;s make<br /><em>something meaningful.</em></h2>
        </div>
        <Link className="round-link" to="/contact" aria-label="Get in touch">↗</Link>
      </div>
      <div className="footer-bottom">
        <Link className="footer-name" to="/">Hermela Bereket<span>.</span></Link>
        <p>Independent designer · Ethiopia</p>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  )
}
