import { useState } from "react";
import emailjs from "@emailjs/browser";
import Button from "../common/Button";

export default function ContactForm() {
  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    from_name: false,
    from_email: false,
    message: false,
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    // Mark sabhi fields ko touched taaki submit ke waqt validations show ho jayein agar empty hain
    setTouched({
      from_name: true,
      from_email: true,
      message: true,
    });

    if (!form.from_name || !form.from_email || !form.message) return;

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.from_name,
          from_email: form.from_email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log("SUCCESS:", result);
      setStatusMessage({
        type: "success",
        text: "✅ Message sent successfully! I will get back to you soon.",
      });

      setForm({
        from_name: "",
        from_email: "",
        message: "",
      });

      setTouched({
        from_name: false,
        from_email: false,
        message: false,
      });
    } catch (error) {
      console.log("EMAILJS ERROR:", error);
      setStatusMessage({
        type: "error",
        text: `❌ Failed to send message. Status: ${error.status || "Unknown"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to dynamically change input border styling based on validation
  const getInputClass = (fieldName) => {
    const isTouched = touched[fieldName];
    const hasValue = form[fieldName].trim().length > 0;

    let baseClass =
      "w-full rounded-xl bg-[#0B1120] border px-3.5 sm:px-4 py-3 sm:py-3.5 lg:py-2.5 2xl:py-3.5 text-sm sm:text-base text-white outline-none transition duration-200 ";

    if (isTouched && !hasValue) {
      return baseClass + "border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/30";
    } else if (isTouched && hasValue) {
      return baseClass + "border-emerald-500/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";
    } else {
      return baseClass + "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";
    }
  };

  return (
    <form
      onSubmit={sendEmail}
      className="
        relative
        overflow-hidden
        rounded-2xl
        sm:rounded-3xl
        border
        border-slate-700
        bg-[#111827]
        pl-4
        pr-4
        py-4
        sm:pl-8
        sm:pr-6
        sm:py-6
        md:pl-10
        md:pr-8
        md:py-8
        lg:py-6
        2xl:py-10
        shadow-xl
      "
    >
      <h3 className="text-base sm:text-xl md:text-2xl lg:text-xl 2xl:text-2xl font-bold text-center mb-3 sm:mb-5 lg:mb-4 text-white">
        Send a Message
      </h3>

      {/* Inline Status Feedback Banner */}
      {statusMessage.text && (
        <div
          className={`mb-3 sm:mb-5 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 lg:space-y-2.5 2xl:space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            name="from_name"
            placeholder="John Doe"
            value={form.from_name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={getInputClass("from_name")}
          />
          {touched.from_name && !form.from_name && (
            <span className="inline-block text-xs text-red-400 mt-1.5">Name is required</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-1.5">
            Your Email
          </label>
          <input
            type="email"
            name="from_email"
            placeholder="john@example.com"
            value={form.from_email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={getInputClass("from_email")}
          />
          {touched.from_email && !form.from_email && (
            <span className="inline-block text-xs text-red-400 mt-1.5">Email is required</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-1.5">
            Message
          </label>
          <textarea
            rows="3"
            name="message"
            placeholder="Write your message here..."
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`${getInputClass("message")} resize-none`}
          />
          {touched.message && !form.message && (
            <span className="inline-block text-xs text-red-400 mt-1.5">Message cannot be empty</span>
          )}
        </div>

        <div className="pt-1 sm:pt-2 lg:pt-0.5 2xl:pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center py-3 sm:py-3.5 lg:py-2.5 2xl:py-3.5 text-sm sm:text-base font-semibold"
          >
            {loading ? "Sending Message..." : "Send Message"}
          </Button>
        </div>
      </div>
    </form>
  );
}