import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import flappy from "./assets/flappy.png";

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
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

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

  return (
    <nav className="nav">
      <div className="nav-left">
        <a
          href="https://github.com/nickwhite98?tab=repositories"
          target="_blank"
        >
          <img src={flappy} className="logo" alt="Twotter logo" />
        </a>
        <h1 className="title">Two-tter</h1>
      </div>

      <div className="nav-links">
        {token && <Link to="/">Home</Link>}
        {token && <Link to={`/account/${token.username}`}>Account</Link>}
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/signup">Sign Up</Link>}
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
