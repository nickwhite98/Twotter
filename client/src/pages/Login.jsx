import { useState, useEffect, useContext } from "react";
import { LoginForm } from "@/components/login-form";

import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";
import { AuthContext } from "../AuthProvider.jsx";

function Login() {
  const { token } = useContext(AuthContext);

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
export default Login;
