import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/seo'

const skills = ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Visual identity', 'Typography', 'Digital design', 'Layout & print']

export default function About() {
  usePageMeta('About', 'Meet Hermela Bereket, an Information Science graduate from the University of Gondar with a passion for graphic design.')

  return (
    <section className="section-wrap page-section about-page">
      <div className="page-heading">
        <span className="eyebrow">A little about me</span>
        <h1>Curious by nature.<br /><em>Creative by choice.</em></h1>
      </div>
      <div className="about-grid">
        <div className="profile-art" role="img" aria-label="Illustrated portrait placeholder for Hermela Bereket">
          <div className="profile-sun" /><div className="profile-silhouette"><span /></div>
          <span className="profile-caption">A portrait, in progress</span>
          <span className="profile-monogram">HB.</span>
        </div>
        <div className="about-copy">
          <span className="eyebrow">The person behind the pixels</span>
          <h2>Hello, I&apos;m Hermela.</h2>
          <p>I&apos;m an Information Science graduate from the University of Gondar, Ethiopia, with a lasting curiosity for how people connect with the things they see.</p>
          <p>Graphic design is where my technical understanding meets my visual instinct. I love turning ideas into thoughtful, useful design—paying close attention to the small details that make the whole thing feel right.</p>
          <p>When I&apos;m not working on a design, I&apos;m usually collecting inspiration, learning something new, or sketching out what could be next.</p>
          <div className="education-note"><span className="eyebrow">A little foundation</span><strong>Information Science</strong><span>University of Gondar · Ethiopia</span></div>
        </div>
      </div>
      <div className="skills-section">
        <div><span className="eyebrow">What I bring to the table</span><h2>My toolkit</h2></div>
        <ul className="skills-list">{skills.map((skill) => <li key={skill}>{skill}<span aria-hidden="true">↗</span></li>)}</ul>
      </div>
      <div className="about-cta"><p>Have an idea that needs a visual voice?</p><Link className="button button-dark" to="/contact">Let&apos;s talk <span aria-hidden="true">↗</span></Link></div>
    </section>
  )
}
