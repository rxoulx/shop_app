import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, rolesChoPhep }) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (rolesChoPhep && !rolesChoPhep.includes(auth.user.role)) {
    return <p style={{ color: 'red', padding: 20 }}>Ban khong co quyen truy cap trang nay.</p>;
  }

  return children;
}

export default ProtectedRoute;
