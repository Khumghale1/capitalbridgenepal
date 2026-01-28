import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await api.auth.login(email, password);

      // Check if user is admin
      if (data.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin credentials required.');
      }

      // Store user data and token
      localStorage.setItem('authToken', data.authToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set authentication state
      login("admin");

      setNotification({
        type: 'success',
        title: 'Admin Login Successful!',
        message: `Welcome back, ${data.user.username}!`
      });

      // Redirect to admin dashboard after a short delay to show the success message
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Invalid Credentials',
        message: error instanceof Error ? error.message : 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Admin Login Form Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Admin Sign in</CardTitle>
                <CardDescription>
                  Enter your admin credentials to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {notification && (
                    <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className={notification.type === 'success' ? 'border-green-500 bg-green-50 text-green-900' : ''}>
                      {notification.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 !text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>{notification.title}</AlertTitle>
                      <AlertDescription>{notification.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
