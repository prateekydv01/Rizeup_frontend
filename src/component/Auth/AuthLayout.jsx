import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

function AuthLayout({ children, authentication = true }) {
  const authStatus = useSelector((state) => state.auth.status)
  const location = useLocation()

  if (authentication && !authStatus) {
    // Not logged in but trying to access a protected route
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!authentication && authStatus) {
    // Logged in but trying to access login/signup
    return <Navigate to="/" replace />
  }

  return children
}

export default AuthLayout
