import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import api from "./api.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

// make default routing work in a good way
// Add some more routes, have one of them be dynamic
// add stuff
// git workflows/pr reviews
// auto deploy
// make shit pretty
// outsource security??????
// redux
