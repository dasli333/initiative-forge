import { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2, Mail } from "lucide-react";

interface PasswordResetFormProps {
  isResettingPassword?: boolean;
  token?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function PasswordResetForm({ isResettingPassword = false, token }: PasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const validateEmailForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email]);

  const validatePasswordForm = useCallback((): boolean => {
    const errors: FormErrors = {};

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
  }, [password, confirmPassword]);

  const handleRequestReset = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setFieldErrors({});

      if (!validateEmailForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // TODO: Implement Supabase resetPasswordForEmail in backend phase
        console.log("Password reset request for:", email);

        // Placeholder error for UI demonstration
        throw new Error("Authentication not yet implemented. Backend integration coming in next phase.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [email, validateEmailForm]
  );

  const handleSetNewPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setFieldErrors({});

      if (!validatePasswordForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // TODO: Implement Supabase updateUser in backend phase
        console.log("Setting new password with token:", token);

        // Placeholder error for UI demonstration
        throw new Error("Authentication not yet implemented. Backend integration coming in next phase.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [password, confirmPassword, token, validatePasswordForm]
  );

  // Success state for email sent
  if (isSuccess && !isResettingPassword) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-blue-950/30 border-blue-800">
          <Mail className="h-4 w-4 text-blue-400" />
          <AlertTitle className="text-blue-300">Check your email</AlertTitle>
          <AlertDescription className="text-blue-200">
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox
            and click the link to reset your password.
          </AlertDescription>
        </Alert>

        <Button asChild className="w-full">
          <a href="/auth/login">Back to login</a>
        </Button>
      </div>
    );
  }

  // Success state for password changed
  if (isSuccess && isResettingPassword) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-green-950/30 border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-green-300">Password changed successfully!</AlertTitle>
          <AlertDescription className="text-green-200">
            Your password has been updated. You can now sign in with your new password.
          </AlertDescription>
        </Alert>

        <Button asChild className="w-full">
          <a href="/auth/login">Go to login page</a>
        </Button>
      </div>
    );
  }

  // Set new password form (when user clicks email link)
  if (isResettingPassword) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Set new password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your new password below
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSetNewPassword} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor={passwordId} className="text-slate-200">
              New password
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
              Confirm new password
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
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-400 mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Request password reset form
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Reset your password</h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRequestReset} className="space-y-4" noValidate>
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </div>
  );
}
