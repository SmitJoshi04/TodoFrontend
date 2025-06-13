import { Navigate } from "react-router-dom"
import { getAccessToken } from "../services/auth"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = getAccessToken()
  const isAdmin = localStorage.getItem("isAdmin")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && isAdmin !== "true") {
    return <Navigate to="/login" replace />
  }

  if (!adminOnly && isAdmin !== "false") {
    return <Navigate to="/login" replace />
  }

  return children
}
