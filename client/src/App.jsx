import { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoutes.jsx";
import { AuthProvider, AuthContext } from "./AuthProvider.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const Navigation = (props) => {
  const { token } = useContext(AuthContext);
  const { onLogout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/login">Login</Link>
      <Link to="home">Home</Link>
      {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

export default App;

// make default routing work in a good way
// Add some more routes, have one of them be dynamic
// add stuff
// git workflows/pr reviews
// auto deploy
// make shit pretty
// outsource security??????
// redux
// tests
