import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ResetPasswordProps {
  onSuccess: () => void;
}

export function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      console.error("Error updating password:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 pt-16">
        <div className="w-16 h-16 rounded-full bg-[#E8FDF0] flex items-center justify-center">
          <CheckCircle size={36} color="#10B981" />
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "#1C0E0A",
          }}
        >
          Password updated!
        </h2>
        <p style={{ color: "#8B6558", fontSize: 15, maxWidth: 300 }}>
          Your password has been successfully reset. Redirecting you to the sign in page...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock size={20} color="#C1415A" />
          <span
            style={{
              fontSize: 12,
              color: "#8B6558",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Security
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            color: "#1C0E0A",
            lineHeight: 1.2,
          }}
        >
          Update your <span style={{ color: "#C1415A", fontStyle: "italic" }}>password</span>
        </h1>
        <p style={{ color: "#8B6558", fontSize: 14, lineHeight: 1.5 }}>
          Enter a new secure password below to update your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-semibold mb-1" style={{ color: "#8B6558" }}>
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-10 rounded-xl border border-border outline-none focus:border-primary text-sm transition-colors"
              style={{
                background: "#FDF0E8",
                color: "#1C0E0A",
                fontFamily: "var(--font-body)",
                borderColor: password ? "#C1415A" : "rgba(139,101,88,0.2)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPw ? (
                <EyeOff size={16} color="#8B6558" />
              ) : (
                <Eye size={16} color="#8B6558" />
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <p style={{ color: "#C1415A", fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "#C1415A", color: "#fff" }}
        >
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
