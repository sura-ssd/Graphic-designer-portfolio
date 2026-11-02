import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { useToast } from '../../components/ToastProvider'
import { useCategories } from '../../hooks/useCategories'
import { getPortfolioImagePath, requireSupabase } from '../../lib/supabaseClient'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function WorkForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const { categories, loading: categoriesLoading } = useCategories()
  const fileInput = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', category: '', featured: false, image_url: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    let active = true
    const loadWork = async () => {
      try {
        const { data, error } = await requireSupabase().from('works').select('*').eq('id', id).single()
        if (!active) return
        if (error) throw error
        setForm({ title: data.title ?? '', description: data.description ?? '', category: data.category ?? '', featured: Boolean(data.featured), image_url: data.image_url ?? '' })
        setLoading(false)
      } catch (error) {
        if (!active) return
        toast(error instanceof Error ? error.message : 'Unable to load this project.', 'error')
        navigate('/admin', { replace: true })
      }
    }
    loadWork()
    return () => { active = false }
  }, [id, isEditing, navigate, toast])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return undefined
    }
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const handleFile = (file) => {
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast('Choose a JPG, PNG, WebP, or GIF image.', 'error')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast('Images must be 5 MB or smaller.', 'error')
      return
    }
    setSelectedFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.category) {
      toast('Add a project title and category.', 'error')
      return
    }
    if (!selectedFile && !form.image_url) {
      toast('Choose an image for this project.', 'error')
      return
    }
    setSaving(true)
    let client
    let uploadedPath = null
    try {
      client = requireSupabase()
      let imageUrl = form.image_url
      if (selectedFile) {
        const extension = selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const objectPath = `${crypto.randomUUID()}.${extension}`
        const { error: uploadError } = await client.storage.from('portfolio-images').upload(objectPath, selectedFile, { contentType: selectedFile.type, upsert: false })
        if (uploadError) throw uploadError
        uploadedPath = objectPath
        imageUrl = client.storage.from('portfolio-images').getPublicUrl(objectPath).data.publicUrl
      }
      const project = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        featured: form.featured,
        image_url: imageUrl,
      }
      const { error } = isEditing
        ? await client.from('works').update(project).eq('id', id)
        : await client.from('works').insert(project)
      if (error) throw error
      if (isEditing && selectedFile) {
        const previousPath = getPortfolioImagePath(form.image_url)
        if (previousPath) {
          const { error: cleanupError } = await client.storage.from('portfolio-images').remove([previousPath])
          if (cleanupError) toast(`Project saved, but the previous image could not be removed: ${cleanupError.message}`, 'error')
        }
      }
      uploadedPath = null
      toast(isEditing ? 'Project updated.' : 'Project published.')
      navigate('/admin', { replace: true })
    } catch (error) {
      if (uploadedPath && client) {
        const { error: cleanupError } = await client.storage.from('portfolio-images').remove([uploadedPath])
        if (cleanupError) console.error('Unable to clean up an unused portfolio image:', cleanupError.message)
      }
      toast(error instanceof Error ? error.message : 'Unable to save this project.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLayout title={isEditing ? 'Edit project' : 'New project'}><div className="admin-loading">Loading project…</div></AdminLayout>

  return (
    <AdminLayout title={isEditing ? 'Edit project' : 'New project'}>
      <form className="work-editor" onSubmit={handleSubmit}>
        <div className="editor-fields">
          <section className="admin-panel editor-panel">
            <div className="panel-heading"><div><h2>Project details</h2><p>Give this piece a name and a little context.</p></div></div>
            <label>Project title<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <label>Description <span className="optional-label">Optional</span><textarea rows="6" maxLength={4000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label>Category<select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="" disabled>{categoriesLoading ? 'Loading categories…' : 'Select a category'}</option>{categories.map((category) => <option value={category.name} key={category.id}>{category.name}</option>)}</select>{!categoriesLoading && categories.length === 0 && <span className="category-form-note">No categories yet. Add one from the dashboard.</span>}</label>
            <label className="featured-toggle"><span><strong>Feature this project</strong><small>Show it in the featured work section on your home page.</small></span><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /></label>
          </section>
          <section className="admin-panel editor-panel">
            <div className="panel-heading"><div><h2>Cover image</h2><p>JPG, PNG, WebP, or GIF · up to 5 MB</p></div></div>
            <button type="button" className={`upload-zone ${previewUrl || form.image_url ? 'has-image' : ''}`} onClick={() => fileInput.current?.click()} aria-label="Choose a project cover image">
              {(previewUrl || form.image_url) ? <img src={previewUrl || form.image_url} alt="Project cover preview" /> : <span className="upload-prompt"><span className="upload-icon">↑</span><strong>Choose an image</strong><small>JPG, PNG, WebP, or GIF</small></span>}
            </button>
            <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => handleFile(event.target.files?.[0])} />
            {(previewUrl || form.image_url) && <button className="remove-image" type="button" onClick={() => { setSelectedFile(null); setForm({ ...form, image_url: '' }); if (fileInput.current) fileInput.current.value = '' }}>Remove image</button>}
          </section>
        </div>
        <div className="editor-actions"><Link className="text-link" to="/admin">Cancel</Link><button className="button button-dark" type="submit" disabled={saving}>{saving ? 'Saving…' : isEditing ? 'Save changes' : 'Publish project'} <span aria-hidden="true">↗</span></button></div>
      </form>
    </AdminLayout>
  )
}
