import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Works from './pages/Works'
import Dashboard from './pages/admin/Dashboard'
import Login from './pages/admin/Login'
import Messages from './pages/admin/Messages'
import WorkForm from './pages/admin/WorkForm'

function PublicLayout() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<Works />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/works/new" element={<WorkForm />} />
        <Route path="/admin/works/:id/edit" element={<WorkForm />} />
        <Route path="/admin/messages" element={<Messages />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<PublicLayout />} />
    </Routes>
  )
}
