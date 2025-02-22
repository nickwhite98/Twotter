import { FormEvent, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import api from "../api.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../AuthProvider.jsx";

// Define expected types from the AuthContext
interface AuthContextType {
  token: string;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onLogout: () => void;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setreEnterPassword] = useState("");
  const [userAvailableMsg, setUserAvailableMsg] = useState("");
  const [isUserAvailable, setIsUserAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (!username) {
      setUserAvailableMsg("");
      return;
    } // don't check empty username input

    const delay = setTimeout(() => {
      checkUsernameAvailable(); //Call API after delay
    }, 500);

    return () => clearTimeout(delay); // clear timer if user keeps typing
  }, [username]);

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (password !== reEnterPassword || password === "") {
      alert("Passwords do not match, please try again");
      setPassword("");
      setreEnterPassword("");
    } else if (!isUserAvailable) {
      alert("Username is not available");
    } else {
      const response = await api.post("/user", {
        username: username,
        password: password,
      });

      if (response.data.success) {
        navigate("/login");
      }
    }
  };
  const checkUsernameAvailable = async function () {
    const response = await api.post("/userexist", {
      username: username,
    });
    if (response.data.userExist) {
      setUserAvailableMsg(`Username is not available`);
      setIsUserAvailable(false);
    } else {
      setUserAvailableMsg("");
      setIsUserAvailable(true);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 md:w-[400px]", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-left">Create Account</CardTitle>
          <CardDescription className="text-left">
            Create a username and password below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="text-left">Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <p className="text-red-500">{userAvailableMsg}</p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-left">Password</Label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <div className="flex items-center">
                  <Label className="text-left">Re-enter Password</Label>
                </div>
                <Input
                  type="password"
                  value={reEnterPassword}
                  onChange={(e) => {
                    setreEnterPassword(e.target.value);
                  }}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up!
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
