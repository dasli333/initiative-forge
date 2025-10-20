import { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface LoginFormProps {
  redirect?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm({ redirect = "/campaigns" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setFieldErrors({});

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // TODO: Implement Supabase authentication in backend phase
        // For now, just show a placeholder message
        console.log("Login attempt:", { email, redirect });

        // Placeholder error for UI demonstration
        throw new Error("Authentication not yet implemented. Backend integration coming in next phase.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, redirect, validateForm]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Sign in to your account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your credentials to access your campaigns
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor={emailId} className="text-slate-200">
            Email address
          </Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="you@example.com"
            disabled={isLoading}
            aria-invalid={!!fieldErrors.email}
            className={`bg-slate-900 text-slate-100 placeholder:text-slate-500 ${
              fieldErrors.email
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                : "border-slate-700"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-400 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={passwordId} className="text-slate-200">
              Password
            </Label>
            <a
              href="/auth/reset-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="Enter your password"
            disabled={isLoading}
            aria-invalid={!!fieldErrors.password}
            className={`bg-slate-900 text-slate-100 placeholder:text-slate-500 ${
              fieldErrors.password
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                : "border-slate-700"
            }`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-400 mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
