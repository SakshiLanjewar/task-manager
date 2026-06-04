import React, { useState, useEffect } from "react";
import "../styles/Login.css";

/**
 * Login — the gateway to the TaskFlow dashboard.
 * Features animated floating orbs, glowing input fields,
 * and a smooth slide-in card on mount.
 */
function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Minimum 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    // Simulated auth delay — replace with real API call
    // e.g. await api.post('/auth/login', form)
    setTimeout(() => {
      setLoading(false);
      onLogin(); // pass control back to App
    }, 1200);
  };

  return (
    <div className="login-root">

      {/* ── Animated background orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {/* ── Noise grain overlay ── */}
      <div className="grain" />

      {/* ── Floating shapes ── */}
      <div className="shape shape-ring" />
      <div className="shape shape-dot-grid" />

      {/* ── Card ── */}
      <div className={`login-card ${animate ? "card-visible" : ""}`}>

        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="brand-icon">
            <span>⚡</span>
          </div>
          <h1 className="brand-name">TaskFlow</h1>
          <p className="brand-tagline">Organize. Focus. Deliver.</p>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>Welcome back</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="login-form">

          {/* Email */}
          <div className={`lf-group ${errors.email ? "lf-error" : ""} ${form.email ? "lf-filled" : ""}`}>
            <span className="lf-icon">✉️</span>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              autoComplete="email"
            />
            <label htmlFor="email">Email address</label>
            <div className="lf-glow" />
            {errors.email && <span className="lf-err-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`lf-group ${errors.password ? "lf-error" : ""} ${form.password ? "lf-filled" : ""}`}>
            <span className="lf-icon">🔒</span>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPass((p) => !p)}
              aria-label="Toggle password visibility"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
            <div className="lf-glow" />
            {errors.password && <span className="lf-err-msg">{errors.password}</span>}
          </div>

          {/* Forgot password */}
          <div className="login-meta">
            <button type="button" className="forgot-btn">Forgot password?</button>
          </div>

          {/* Submit */}
          <button type="submit" className={`login-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? (
              <span className="btn-loader" />
            ) : (
              <>
                <span>Sign In</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>

        </form>

        {/* Social login divider */}
        <div className="social-divider"><span>or continue with</span></div>

        {/* Social buttons */}
        <div className="social-row">
          <button className="social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.5-2.9-11.3-7.1l-6.5 5C9.8 39.8 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
            Google
          </button>
          <button className="social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.9 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        {/* Sign up link */}
        <p className="signup-link">
          Don't have an account?{" "}
          <button type="button" className="signup-btn">Create one free</button>
        </p>

      </div>
    </div>
  );
}

export default Login;