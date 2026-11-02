import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
  }
  return supabase
}

export function getPortfolioImagePath(imageUrl) {
  try {
    const marker = '/storage/v1/object/public/portfolio-images/'
    const pathname = new URL(imageUrl).pathname
    const markerIndex = pathname.indexOf(marker)
    return markerIndex < 0 ? null : decodeURIComponent(pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}
