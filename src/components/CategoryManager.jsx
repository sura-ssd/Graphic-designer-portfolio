import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { requireSupabase } from '../lib/supabaseClient'
import { useToast } from './ToastProvider'

export default function CategoryManager() {
  const { categories, loading, refresh } = useCategories()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const addCategory = async (event) => {
    event.preventDefault()
    const categoryName = name.trim().replace(/\s+/g, ' ')
    if (!categoryName) {
      toast('Enter a category name.', 'error')
      return
    }
    if (categoryName.length > 50) {
      toast('Category names must be 50 characters or fewer.', 'error')
      return
    }

    setSaving(true)
    try {
      const client = requireSupabase()
      const { data: lastCategory, error: positionError } = await client
        .from('categories')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (positionError) throw positionError

      const { error } = await client.from('categories').insert({
        name: categoryName,
        position: (lastCategory?.position ?? -1) + 1,
      })
      if (error) throw error
      setName('')
      toast('Category added.')
      await refresh()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to add this category.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const removeCategory = async (category) => {
    try {
      const client = requireSupabase()
      const { count, error: countError } = await client
        .from('works')
        .select('id', { count: 'exact', head: true })
        .eq('category', category.name)
      if (countError) throw countError
      if (count > 0) {
        toast(`"${category.name}" is assigned to ${count} ${count === 1 ? 'project' : 'projects'}. Reassign those projects before removing this category.`, 'error')
        return
      }

      if (!window.confirm(`Remove the "${category.name}" category?`)) return
      const { error } = await client.from('categories').delete().eq('id', category.id)
      if (error) throw error
      toast('Category removed.')
      await refresh()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Unable to remove this category.', 'error')
    }
  }

  return (
    <section className="admin-panel category-manager">
      <div className="panel-heading">
        <div><h2>Categories</h2><p>Manage the categories available in your public portfolio and project editor.</p></div>
        <span>{loading ? 'Loading…' : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`}</span>
      </div>
      <form className="category-add-form" onSubmit={addCategory}>
        <label className="sr-only" htmlFor="new-category">New category name</label>
        <input id="new-category" value={name} onChange={(event) => setName(event.target.value)} maxLength={50} placeholder="e.g. Packaging" disabled={saving} />
        <button className="button button-dark" type="submit" disabled={saving || loading}>{saving ? 'Adding…' : 'Add category'} <span aria-hidden="true">＋</span></button>
      </form>
      {loading ? <div className="admin-loading" role="status">Loading categories…</div> : categories.length ? (
        <ul className="category-manager-list">
          {categories.map((category) => (
            <li key={category.id}>
              <span className="category-chip">{category.name}</span>
              <button type="button" onClick={() => removeCategory(category)} aria-label={`Remove ${category.name} category`}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p className="category-manager-empty">No categories yet. Add one to use it on projects.</p>}
    </section>
  )
}
