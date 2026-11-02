import { Link } from 'react-router-dom'
import { useWorks } from '../hooks/useWorks'
import { usePageMeta } from '../lib/seo'
import { Gallery } from '../components/Gallery'

export default function Home() {
  const { works, loading, error } = useWorks({ featuredFirst: true, limit: 6 })
  const heroWorks = works.slice(0, 3)
  usePageMeta('Graphic Designer', 'Hermela Bereket is a graphic designer and Information Science graduate creating thoughtful visual identities and digital experiences.')

  return (
    <>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> Graphic Designer · Ethiopia</span>
          <h1>Designing<br />ideas into<br /><em>feeling.</em></h1>
          <p className="hero-intro">I&apos;m Hermela Bereket. I turn thoughtful ideas into visual stories with clarity, character, and a little unexpected color.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/works">Explore my work <span aria-hidden="true">↗</span></Link>
            <Link className="hero-about-link" to="/about">A little about me <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={`hero-art ${loading ? 'is-loading' : ''}`} aria-label="Selected portfolio designs">
          <div className="hero-art-top"><span>Selected designs</span><span>HB — 01</span></div>
          {heroWorks.length > 0 ? (
            <div className={`hero-design-stack count-${heroWorks.length}`}>
              {heroWorks.map((work, index) => (
                <Link
                  className={`hero-design-card hero-design-card-${index + 1}`}
                  key={work.id}
                  to="/works"
                  aria-label={`View ${work.title} in the portfolio`}
                >
                  <img src={work.image_url} alt={work.title} fetchPriority={index === 0 ? 'high' : undefined} />
                  <span className="hero-design-title">{work.title}</span>
                </Link>
              ))}
            </div>
          ) : loading ? (
            <div className="hero-design-loading" aria-label="Loading selected designs">
              <span /><span /><span />
            </div>
          ) : (
            <div className="hero-design-empty">
              <span className="hero-art-stamp">H<br />B</span>
              <strong>{error ? 'A new collection is on its way.' : 'The first designs are on their way.'}</strong>
              <span>Selected work will appear here.</span>
            </div>
          )}
          <span className="hero-art-label">{heroWorks.length ? `${heroWorks.length} selected ${heroWorks.length === 1 ? 'project' : 'projects'}` : 'Visual stories, made with intention'}</span>
        </div>
        <div className="hero-bottom">
          <span>Independent designer creating with intention.</span>
          <a href="#selected-work" aria-label="Scroll to selected work"><span className="scroll-line" /> Scroll to explore</a>
        </div>
      </section>

      <section className="section-wrap selected-section" id="selected-work">
        <div className="section-heading">
          <div><span className="eyebrow">A few things I&apos;ve made</span><h2>Selected <em>work</em></h2></div>
          <Link className="text-link" to="/works">View all projects <span aria-hidden="true">↗</span></Link>
        </div>
        <Gallery works={works.filter((work) => work.featured)} loading={loading} error={error} featured />
      </section>

      <section className="intro-band">
        <div className="section-wrap intro-band-inner">
          <span className="eyebrow">Design with a little more meaning</span>
          <p>From a first sketch to a final pixel, I create visual stories that feel <em>clear, considered, and completely you.</em></p>
          <Link className="text-link" to="/about">A little about me <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  )
}
