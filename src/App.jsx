import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MagicLinkPage from './pages/MagicLinkPage'
import DashboardPage from './pages/DashboardPage'
import NetworkFoundingPage from './pages/NetworkFoundingPage'
import NetworkInvitePage from './pages/NetworkInvitePage'
import NetworkWorkspacePage from './pages/NetworkWorkspacePage'
import NetworkWaitlistPage from './pages/NetworkWaitlistPage'
import ConsultantProfilePage from './pages/ConsultantProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

const rawBase = import.meta.env.BASE_URL || '/'
const routerBasename =
  rawBase === '/' ? undefined : rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/network" element={<NetworkFoundingPage />} />
        <Route path="/network/request-invite" element={<NetworkWaitlistPage />} />
        <Route path="/network/invite/:token" element={<NetworkInvitePage />} />
        <Route path="/network/invite" element={<NetworkInvitePage />} />
        <Route path="/network/login" element={<LoginPage />} />
        <Route
          path="/network/member"
          element={<ProtectedRoute><NetworkWorkspacePage /></ProtectedRoute>}
        />
        <Route
          path="/network/admin"
          element={<ProtectedRoute><NetworkWorkspacePage admin /></ProtectedRoute>}
        />
        <Route path="/dr/:slug" element={<ConsultantProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/magic" element={<MagicLinkPage />} />
        <Route path="/dashboard/cognition-network" element={<Navigate to="/network/member" replace />} />
        <Route path="/dashboard/network" element={<Navigate to="/network/admin" replace />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
