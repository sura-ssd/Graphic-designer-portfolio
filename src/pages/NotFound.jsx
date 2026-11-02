import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/seo'

export default function NotFound() {
  usePageMeta('Page Not Found', 'The page you are looking for could not be found.')
  return (
    <section className="section-wrap not-found">
      <span className="eyebrow">404 · A small detour</span>
      <h1>This page took<br /><em>another turn.</em></h1>
      <p>Let&apos;s get you back to something lovely.</p>
      <Link to="/" className="button button-dark">Back to home <span aria-hidden="true">↗</span></Link>
    </section>
  )
}
