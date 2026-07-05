import { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type FeedbackType = "existing issue" | "new feature suggestion" | "other";

export function Feedback() {
  const { user, profile } = useAuth();
  
  const [type, setType] = useState<FeedbackType>("existing issue");
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getCustomPrompt = (t: FeedbackType) => {
    switch (t) {
      case "existing issue":
        return "What bug or issue did you encounter? Please provide as much detail as possible so we can fix it.";
      case "new feature suggestion":
        return "What feature or improvement would you like to see? How would it make your experience better?";
      case "other":
        return "Please share your feedback, comments, or suggestions with us!";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please enter your feedback in the box below.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        type,
        message: message.trim(),
        contact_info: contactInfo.trim() || null,
        user_id: user?.id || null,
        user_name: profile?.display_name || user?.email || null,
      };

      const { error } = await supabase.from("feedback").insert(payload);
      if (error) {
        throw error;
      }

      setSubmitted(true);
      setMessage("");
      setContactInfo("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 pt-16">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
          <CheckCircle size={36} color="#4CAF50" />
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "#1C0E0A",
          }}
        >
          Thank you!
        </h2>
        <p style={{ color: "#8B6558", fontSize: 15, maxWidth: 300 }}>
          We appreciate your feedback and will use it to make The Scoop even better.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "#C1415A", color: "#fff" }}
        >
          Submit more feedback
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Intro prompt */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} color="#F59340" />
          <span
            style={{
              fontSize: 12,
              color: "#8B6558",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Feedback Form
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
          Share your{" "}
          <span style={{ color: "#C1415A", fontStyle: "italic" }}>thoughts</span>
        </h1>
        <p style={{ color: "#8B6558", fontSize: 14, lineHeight: 1.5 }}>
          We are always working to make The Scoop the best ice cream companion in America!
          Whether you found a bug, have an amazing feature suggestion, or just want to leave some thoughts, please let us know.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold" style={{ color: "#8B6558" }}>
            WHAT ARE YOU SUBMITTING?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {(["existing issue", "new feature suggestion", "other"] as FeedbackType[]).map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all"
                  style={{
                    background: active ? "#FDE8EF" : "#FDF0E8",
                    borderColor: active ? "#C1415A" : "rgba(139,101,88,0.2)",
                    color: active ? "#C1415A" : "#1C0E0A",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: active ? "#C1415A" : "#8B6558",
                      background: active ? "#C1415A" : "transparent",
                    }}
                  >
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="capitalize">
                    {t === "existing issue" ? "Bug or existing issue" : t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textbox block */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold" style={{ color: "#8B6558" }}>
            DETAILS
          </label>
          <p style={{ color: "#8B6558", fontSize: 13, marginBottom: 4 }}>
            {getCustomPrompt(type)}
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your feedback details here..."
            rows={5}
            className="w-full p-3 rounded-xl border outline-none transition-all text-sm resize-none"
            style={{
              background: "#FDF0E8",
              color: "#1C0E0A",
              borderColor: message ? "#C1415A" : "rgba(139,101,88,0.2)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>

        {/* Optional contact info */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold" style={{ color: "#8B6558" }}>
            CONTACT INFO (OPTIONAL)
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="(Optional) Name or contact info for any questions"
            className="w-full px-3 py-3 rounded-xl border outline-none transition-all text-sm"
            style={{
              background: "#FDF0E8",
              color: "#1C0E0A",
              borderColor: contactInfo ? "#C1415A" : "rgba(139,101,88,0.2)",
              fontFamily: "var(--font-body)",
            }}
          />
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
          <Send size={15} />
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
