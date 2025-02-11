import { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
  useParams,
} from "react-router-dom";

//Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoutes.jsx";
import { AuthProvider, AuthContext } from "./AuthProvider.jsx";
import { SignUp } from "./pages/Signup.jsx";
import Account from "./pages/Account.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/:username"
            element={
              <ProtectedRoute>
                <Account />
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
    <nav className="nav">
      <h1>Two-tter</h1>
      <div className="nav-links">
        <Link to="home">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to={`/account/${token.username}`}>Account</Link>
        {token && (
          <button className="nav-links" type="button" onClick={onLogout}>
            Sign Out
          </button>
        )}
      </div>
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
