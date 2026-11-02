import { useState } from 'react'
import WorkCard from './WorkCard'
import Lightbox from './Lightbox'
import { useCategories } from '../hooks/useCategories'

export function Gallery({ works, loading, error = '', featured = false }) {
  const [category, setCategory] = useState('All')
  const [selectedWork, setSelectedWork] = useState(null)
  const { categories: managedCategories } = useCategories()
  const categories = ['All', ...managedCategories.map((item) => item.name)]
  const visibleWorks = category === 'All' ? works : works.filter((work) => work.category === category)

  if (loading) {
    return (
      <div className="work-grid" aria-label="Loading projects" aria-busy="true">
        {Array.from({ length: featured ? 6 : 8 }, (_, index) => <div className="skeleton-card" key={index}><div /></div>)}
      </div>
    )
  }

  return (
    <>
      {!featured && (
        <div className="filter-list" role="group" aria-label="Filter projects by category">
          {categories.map((item) => (
            <button key={item} type="button" className={`filter-button ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>
              {item}
            </button>
          ))}
        </div>
      )}
      {error && works.length === 0 ? (
        <div className="empty-state"><span className="eyebrow">A little pause</span><h2>Work is taking a moment to load.</h2><p>Please try again shortly.</p></div>
      ) : visibleWorks.length === 0 ? (
        <div className="empty-state"><span className="eyebrow">The next chapter</span><h2>{category === 'All' ? 'New work is on its way.' : `No ${category.toLowerCase()} projects yet.`}</h2><p>In the meantime, get in touch and tell me what you are dreaming up.</p></div>
      ) : (
        <div className="work-grid">
          {visibleWorks.map((work, index) => <WorkCard key={work.id} work={work} index={index} onSelect={setSelectedWork} />)}
        </div>
      )}
      <Lightbox work={selectedWork} onClose={() => setSelectedWork(null)} />
    </>
  )
}
