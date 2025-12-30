import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Trophy, X, ShieldCheck, Mail, Lock } from "lucide-react";
import { resetPasswordApi } from "../services/api";

type LoginScreenProps = {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignUp: () => void;
};

export default function LoginScreen({ onLogin, onNavigateToSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset Password State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1); // 1: Email, 2: New Password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onLogin(email, password);
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetStep === 1) {
      setResetLoading(true);
      setTimeout(() => {
        setResetStep(2);
        setResetLoading(false);
      }, 800);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setResetLoading(true);
    try {
      await resetPasswordApi(resetEmail, newPassword);
      alert("Password reset successfully! You can now login with your new password.");
      setShowResetModal(false);
      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setResetStep(1);
    } catch (err: any) {
      alert(err.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button onClick={onNavigateToSignUp} className="font-medium text-primary hover:underline">
            Sign up
          </button>
        </div>
      </Card>

      {/* Forget Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">Reset Password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {resetStep === 1
                  ? "Enter your email to verify your account"
                  : "Create a new strong password"}
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {resetStep === 1 ? (
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Register Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <Input
                      id="resetEmail"
                      type="email"
                      className="pl-10 h-11"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                      <Input
                        id="newPassword"
                        type="password"
                        className="pl-10 h-11"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-10 h-11"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full h-11 font-bold shadow-lg" disabled={resetLoading}>
                {resetLoading ? "Verifying..." : resetStep === 1 ? "Verify Email" : "Reset Password"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}