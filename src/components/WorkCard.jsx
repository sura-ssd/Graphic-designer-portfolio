import { motion } from 'framer-motion'

export default function WorkCard({ work, onSelect, index = 0 }) {
  return (
    <motion.button
      type="button"
      className="work-card"
      onClick={() => onSelect?.(work)}
      aria-label={`View ${work.title}, ${work.category}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
      whileHover={{ y: -5 }}
    >
      <div className="work-card-image">
        <img src={work.image_url} alt={work.title} loading="lazy" />
        <span className="work-card-open" aria-hidden="true">↗</span>
      </div>
      <div className="work-card-copy">
        <div>
          <h3>{work.title}</h3>
          <p>{work.category}</p>
        </div>
        <span className="work-card-year">
          {work.created_at ? new Date(work.created_at).getFullYear() : ''}
        </span>
      </div>
    </motion.button>
  )
}
