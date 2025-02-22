import { FormEvent, useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { onLogin } = useContext<AuthContextType>(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailMsg, setLoginFailMsg] = useState<string | null>(null);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // ✅ Now TypeScript knows onLogin returns Promise<boolean>
      const loginResult = await onLogin(username, password);

      if (!loginResult) {
        setLoginFailMsg(
          "Login attempt failed, please check username and password and try again"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginFailMsg("An unexpected error occurred. Please try again later.");
    }
  };

  const handleForgotPassword = function () {
    alert(
      "Sorry this functionality doesn't exist yet. Just make a new account"
    );
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-left">Login</CardTitle>
          <CardDescription className="text-left">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-left">
                  Username
                </Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-left">
                    Password
                  </Label>
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onFocus={(e) => (e.target.placeholder = "")} // Clears placeholder on focus
                  onBlur={(e) => (e.target.placeholder = "Password")}
                  placeholder="Password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-red-500">{loginFailMsg}</p>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
