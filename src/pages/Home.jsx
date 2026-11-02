import { Link } from 'react-router-dom'
import { useWorks } from '../hooks/useWorks'
import { usePageMeta } from '../lib/seo'
import { Gallery } from '../components/Gallery'

export default function Home() {
  const { works, loading, error } = useWorks({ featuredOnly: true, limit: 6 })
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
        <div className="hero-art" aria-label="Abstract artwork in warm colors" role="img">
          <div className="hero-art-top"><span>Selected studies</span><span>HB — 01</span></div>
          <div className="hero-art-circle" />
          <div className="hero-art-shape" />
          <div className="hero-art-orbit" />
          <span className="hero-art-caption">Form follows<br />feeling.</span>
          <span className="hero-art-stamp">H<br />B</span>
          <span className="hero-art-label">Color / form / feeling</span>
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
        <Gallery works={works} loading={loading} error={error} featured />
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
