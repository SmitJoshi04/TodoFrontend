import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient"
import { Suspense, lazy } from "react"
import "./App.css"

const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Admin = lazy(() => import("./pages/Admin"))
const Home = lazy(() => import("./pages/Home"))
const Profile = lazy(() => import("./pages/Profile"))
const NotFound = lazy(() => import("./components/NotFound"))

const UserLayout = lazy(() => import("./components/Layout/UserLayout"))
const AdminLayout = lazy(() => import("./components/Layout/AdminLayout"))

import ProtectedRoute from "./components/ProtectedRoute"

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={PageLoader}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile-admin" element={<Profile />} />
            </Route>
            <Route
              element={
                <ProtectedRoute adminOnly={false}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  )
}

export default App
