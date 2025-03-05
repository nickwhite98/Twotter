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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

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
    <NavigationMenu className="bg-slate-800 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center px-4 py-2 w-full">
        {/* Left side: logo and title */}
        <div className="flex items-center">
          <a
            href="https://github.com/nickwhite98?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            <img src={flappy} alt="Twotter logo" className="h-8 w-8" />
          </a>
          <h1 className="text-white text-2xl font-bold ml-2">Scoopty</h1>
        </div>

        {/* Right side: navigation links */}
        <div className="ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              {token && (
                <NavigationMenuLink asChild>
                  <Link to="/" className="text-white hover:underline px-4 py-2">
                    Home
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              {token && (
                <NavigationMenuLink asChild>
                  <Link
                    to={`/account/${token.username}`}
                    className="text-white hover:underline px-4 py-2"
                  >
                    Account
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              {!token && (
                <NavigationMenuLink asChild>
                  <Link
                    to="/login"
                    className="text-white hover:underline px-4 py-2"
                  >
                    Login
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              {!token && (
                <NavigationMenuLink asChild>
                  <Link
                    to="/signup"
                    className="text-white hover:underline px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </div>
    </NavigationMenu>
  );
};

export default App;
