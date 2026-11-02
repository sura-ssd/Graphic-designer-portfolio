import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import CategoryManager from '../../components/CategoryManager'
import { useToast } from '../../components/ToastProvider'
import { useWorks } from '../../hooks/useWorks'
import { getPortfolioImagePath, requireSupabase } from '../../lib/supabaseClient'

export default function Dashboard() {
  const { works, loading, refresh } = useWorks()
  const toast = useToast()

  const removeWork = async (work) => {
    if (!window.confirm(`Delete "${work.title}" from your portfolio? This cannot be undone.`)) return
    try {
      const { error } = await requireSupabase().from('works').delete().eq('id', work.id)
      if (error) throw error
      const imagePath = getPortfolioImagePath(work.image_url)
      if (imagePath) {
        const { error: storageError } = await requireSupabase().storage.from('portfolio-images').remove([imagePath])
        if (storageError) toast(`Project deleted, but its image could not be removed: ${storageError.message}`, 'error')
        else toast('Project and image deleted.')
      } else {
        toast('Project deleted.')
      }
      refresh()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to delete this project.', 'error')
    }
  }

  return (
    <AdminLayout title="Projects" action={<Link className="button button-dark admin-action" to="/admin/works/new"><span aria-hidden="true">＋</span> Add a project</Link>}>
      <div className="admin-stats"><div><span>Total projects</span><strong>{loading ? '—' : works.length}</strong></div><div><span>Featured</span><strong>{loading ? '—' : works.filter((work) => work.featured).length}</strong></div><div><span>Latest update</span><strong>{works[0] ? new Date(works[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</strong></div></div>
      <section className="admin-panel">
        <div className="panel-heading"><div><h2>All projects</h2><p>Your portfolio, all in one place.</p></div><span>{works.length} {works.length === 1 ? 'project' : 'projects'}</span></div>
        {loading ? <div className="admin-loading" role="status">Loading your projects…</div> : works.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Project</th><th>Category</th><th>Featured</th><th>Home hero</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{works.map((work) => (
                <tr key={work.id}>
                  <td><div className="table-project"><img src={work.image_url} alt="" /><strong>{work.title}</strong></div></td>
                  <td><span className="category-chip">{work.category}</span></td>
                  <td><span className={`feature-status ${work.featured ? 'is-featured' : ''}`}>{work.featured ? 'Featured' : '—'}</span></td>
                  <td><span className={`feature-status ${work.hero_featured ? 'is-featured' : ''}`}>{work.hero_featured ? 'In hero' : '—'}</span></td>
                  <td>{new Date(work.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td><div className="table-actions"><Link to={`/admin/works/${work.id}/edit`} aria-label={`Edit ${work.title}`}>Edit</Link><button type="button" onClick={() => removeWork(work)} aria-label={`Delete ${work.title}`}>Delete</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="admin-empty"><span className="eyebrow">A blank canvas</span><h2>Your first project starts here.</h2><p>Add a piece of work and it will appear in your public portfolio.</p><Link className="button button-dark" to="/admin/works/new">Add your first project <span aria-hidden="true">↗</span></Link></div>}
      </section>
      <CategoryManager />
    </AdminLayout>
  )
}
