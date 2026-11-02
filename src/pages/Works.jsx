import { Gallery } from '../components/Gallery'
import { useWorks } from '../hooks/useWorks'
import { usePageMeta } from '../lib/seo'

export default function Works() {
  const { works, loading, error } = useWorks()
  usePageMeta('Selected Work', 'Explore branding, poster, social media, illustration, and digital design projects by Hermela Bereket.')

  return (
    <section className="section-wrap page-section works-page">
      <div className="page-heading">
        <span className="eyebrow">A collection of ideas</span>
        <h1>Selected <em>work.</em></h1>
        <p>A few thoughtful things made with curiosity, color, and a love for the details.</p>
      </div>
      <Gallery works={works} loading={loading} error={error} />
    </section>
  )
}
