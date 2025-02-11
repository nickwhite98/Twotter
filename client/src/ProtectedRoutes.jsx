import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
