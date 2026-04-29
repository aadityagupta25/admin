import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/dashboard/Dashboard'
import Users from '../pages/users/Users'
import Banners from '../pages/Banners/Banners'
import Backgrounds from '../pages/backgrounds/Backgrounds'
import Feeds from '../pages/feeds/FeedsNew'
import Party from '../pages/party/Party'
import SoundEffect from '../pages/soundEffect/SoundEffect'
import GiftCatalog from '../pages/gifts/GiftCatalog'
import BatchLevels from '../pages/batchLevels/BatchLevels'
import Settings from '../pages/settings/Settings'
import Profile from '../pages/profile/Profile'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '@/context/AuthContext'

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="banners" element={<Banners />} />
          <Route path="backgrounds" element={<Backgrounds />} />
          <Route path="feeds" element={<Feeds />} />
          <Route path="party" element={<Party />} />
          <Route path="sound-effect" element={<SoundEffect />} />
          <Route path="gifts" element={<GiftCatalog />} />
          <Route path="batch-levels" element={<BatchLevels />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes