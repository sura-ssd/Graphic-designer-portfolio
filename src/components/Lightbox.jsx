import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Lightbox({ work, onClose }) {
  useEffect(() => {
    if (!work) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [work, onClose])

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={{ y: 18, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
          >
            <button type="button" className="icon-button lightbox-close" onClick={onClose} aria-label="Close project details">×</button>
            <div className="lightbox-image"><img src={work.image_url} alt={work.title} /></div>
            <div className="lightbox-copy">
              <span className="eyebrow">{work.category} · {new Date(work.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              <h2 id="lightbox-title">{work.title}</h2>
              {work.description && <p>{work.description}</p>}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
