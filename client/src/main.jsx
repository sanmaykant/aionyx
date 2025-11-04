import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from "./pages/Home";
import { RegisterPage } from './pages/Register'
import { DashboardPage } from './pages/Dashboard'
import { AuthProvider, ProtectedRoute } from './providers/AuthProvider'
import './index.css'

const BrowserRouter=createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={BrowserRouter} />
    </AuthProvider>
  </StrictMode>,
)
