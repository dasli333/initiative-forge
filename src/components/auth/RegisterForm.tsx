import { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register } = useAuthStore();

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, confirmPassword]);

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
        const { error: authError } = await register(email, password);

        if (authError) {
          // Handle specific Supabase error messages
          if (authError.message.includes("already registered")) {
            setError("This email is already registered. Please log in instead.");
          } else if (authError.message.includes("Password should be")) {
            setError("Password does not meet security requirements.");
          } else {
            setError(authError.message);
          }
          return;
        }

        // Registration successful - show success message
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, validateForm, register]
  );

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-green-950/30 border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-green-300">Account created successfully!</AlertTitle>
          <AlertDescription className="text-green-200">
            We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the link to
            verify your account before signing in.
          </AlertDescription>
        </Alert>

        <Button asChild className="w-full">
          <a href="/auth/login">Go to login page</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Join Initiative Forge to manage your campaigns</p>
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
          {fieldErrors.email && <p className="text-sm text-red-400 mt-1">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={passwordId} className="text-slate-200">
            Password
          </Label>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="At least 8 characters"
            disabled={isLoading}
            aria-invalid={!!fieldErrors.password}
            className={`bg-slate-900 text-slate-100 placeholder:text-slate-500 ${
              fieldErrors.password
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                : "border-slate-700"
            }`}
          />
          {fieldErrors.password ? (
            <p className="text-sm text-red-400 mt-1">{fieldErrors.password}</p>
          ) : (
            <p className="text-xs text-slate-500">Must be at least 8 characters long</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={confirmPasswordId} className="text-slate-200">
            Confirm password
          </Label>
          <Input
            id={confirmPasswordId}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            placeholder="Re-enter your password"
            disabled={isLoading}
            aria-invalid={!!fieldErrors.confirmPassword}
            className={`bg-slate-900 text-slate-100 placeholder:text-slate-500 ${
              fieldErrors.confirmPassword
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                : "border-slate-700"
            }`}
          />
          {fieldErrors.confirmPassword && <p className="text-sm text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-xs text-slate-500 text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
