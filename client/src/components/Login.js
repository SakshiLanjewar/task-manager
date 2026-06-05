import React, { useState, useEffect } from "react";
import "../styles/Login.css";

/*
  Screens:
  "login"    → Sign In (default)
  "register" → Create Account
  "forgot"   → Forgot Password (email or phone)
  "otp"      → Enter OTP
  "reset"    → Set New Password
  "success"  → Success Message
*/

// ── localStorage helpers ──────────────────────────────────────
const STORAGE_KEY = "taskflow_users";

const loadUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveUsers = (users) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch {}
};

// ── Email OTP via EmailJS ─────────────────────────────────────
// To enable real email OTP:
// 1. Go to https://www.emailjs.com → free account
// 2. Create a service + email template with variable {{otp}}
// 3. Replace these 3 values below with your own
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

const sendEmailOtp = async (toEmail, otp) => {
  // If EmailJS is not configured, fall back to alert (demo mode)
  if (
    EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
    EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
  ) {
    alert(`📩 Demo Mode — OTP for ${toEmail}:\n\n${otp}\n\n(Configure EmailJS in Login.js to send real emails)`);
    return true;
  }
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: { to_email: toEmail, otp, app_name: "TaskFlow" },
      }),
    });
    return res.status === 200;
  } catch { return false; }
};

// ── SMS OTP via Fast2SMS (India) ──────────────────────────────
// To enable real SMS OTP:
// 1. Go to https://www.fast2sms.com → free account
// 2. Get your API key and replace below
const FAST2SMS_API_KEY = "YOUR_FAST2SMS_API_KEY";

const sendSmsOtp = async (phone, otp) => {
  if (FAST2SMS_API_KEY === "YOUR_FAST2SMS_API_KEY") {
    alert(`📱 Demo Mode — OTP for +91${phone}:\n\n${otp}\n\n(Configure Fast2SMS API key in Login.js to send real SMS)`);
    return true;
  }
  try {
    const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`, {
      method: "GET",
      headers: { "cache-control": "no-cache" },
    });
    const data = await res.json();
    return data.return === true;
  } catch { return false; }
};

// ─────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [screen, setScreen]   = useState("login");
  const [animate, setAnimate] = useState(false);

  // Persist users in localStorage
  const [users, setUsers] = useState(() => loadUsers());

  const updateUsers = (newUsers) => { setUsers(newUsers); saveUsers(newUsers); };

  // ── Register state ───────────────────────────────────────────
  const [regForm, setRegForm]     = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [regErrors, setRegErrors] = useState({});
  const [showRegPass, setShowRegPass]       = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // ── Login state ──────────────────────────────────────────────
  const [loginForm, setLoginForm]     = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPass, setShowLoginPass] = useState(false);

  // ── Google state ─────────────────────────────────────────────
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [googleEmail, setGoogleEmail]         = useState("");
  const [googleEmailError, setGoogleEmailError] = useState("");

  // ── Forgot state ─────────────────────────────────────────────
  const [forgotType, setForgotType]   = useState("email");
  const [forgotInput, setForgotInput] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotTarget, setForgotTarget] = useState("");

  // ── OTP state ────────────────────────────────────────────────
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp]     = useState("");
  const [otpError, setOtpError]         = useState("");
  const [otpTimer, setOtpTimer]         = useState(60);
  const [otpExpired, setOtpExpired]     = useState(false);

  // ── Reset state ──────────────────────────────────────────────
  const [newPass, setNewPass]           = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [newPassError, setNewPassError] = useState("");
  const [showNewPass, setShowNewPass]           = useState(false);
  const [showNewPassConfirm, setShowNewPassConfirm] = useState(false);

  // ── Misc ─────────────────────────────────────────────────────
  const [loading, setLoading]     = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { setTimeout(() => setAnimate(true), 50); }, []);

  // OTP countdown
  useEffect(() => {
    if (screen !== "otp") return;
    setOtpTimer(60); setOtpExpired(false);
    const id = setInterval(() => {
      setOtpTimer((t) => { if (t <= 1) { clearInterval(id); setOtpExpired(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [screen]);

  const switchScreen = (s) => {
    setAnimate(false);
    setTimeout(() => { setScreen(s); setAnimate(true); }, 180);
  };

  // ── Helpers ──────────────────────────────────────────────────
  const isGmail  = (v) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(v.trim());
  const isPhone  = (v) => /^[6-9]\d{9}$/.test(v.trim());
  const makeOtp  = () => Math.floor(100000 + Math.random() * 900000).toString();

  // ── REGISTER ─────────────────────────────────────────────────
  const validateReg = () => {
    const e = {};
    if (!regForm.name.trim())     e.name = "Full name is required";
    if (!regForm.email.trim())    e.email = "Email is required";
    else if (!isGmail(regForm.email)) e.email = "Only @gmail.com email is accepted";
    else if (users.find((u) => u.email === regForm.email.trim().toLowerCase()))
      e.email = "This email is already registered. Please sign in.";
    if (!regForm.phone.trim())    e.phone = "Mobile number is required";
    else if (!isPhone(regForm.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!regForm.password)        e.password = "Password is required";
    else if (regForm.password.length < 6) e.password = "Minimum 6 characters required";
    if (!regForm.confirm)         e.confirm = "Please confirm your password";
    else if (regForm.confirm !== regForm.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const errs = validateReg();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        name: regForm.name.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: regForm.phone.trim(),
        password: regForm.password,
      };
      const updated = [...users, newUser];
      updateUsers(updated);
      setLoading(false);
      setSuccessMsg(`🎉 Registration successful!\nWelcome, ${newUser.name}!\n\nYou can now sign in with your email and password anytime.`);
      switchScreen("success");
    }, 1000);
  };

  // ── LOGIN ─────────────────────────────────────────────────────
  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = "Email is required";
    else if (!isGmail(loginForm.email)) e.email = "Only @gmail.com email is accepted";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === loginForm.email.trim().toLowerCase() && u.password === loginForm.password
      );
      setLoading(false);
      if (user) {
        onLogin();
      } else if (users.length === 0 || !users.find((u) => u.email === loginForm.email.trim().toLowerCase())) {
        setLoginErrors({ general: "⚠️ No account found with this email. Please register first." });
      } else {
        setLoginErrors({ general: "❌ Incorrect password. Please try again or use Forgot Password." });
      }
    }, 1000);
  };

  // ── GOOGLE ────────────────────────────────────────────────────
  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    if (!googleEmail.trim())       { setGoogleEmailError("Email is required"); return; }
    if (!isGmail(googleEmail))     { setGoogleEmailError("Only @gmail.com email is accepted"); return; }
    const user = users.find((u) => u.email === googleEmail.trim().toLowerCase());
    if (!user) { setGoogleEmailError("No account found with this Gmail. Please register first."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  // ── FORGOT PASSWORD ───────────────────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotInput.trim()) { setForgotError("This field is required"); return; }

    let found = null;
    if (forgotType === "email") {
      if (!isGmail(forgotInput)) { setForgotError("Only @gmail.com email is accepted"); return; }
      found = users.find((u) => u.email === forgotInput.trim().toLowerCase());
      if (!found) { setForgotError("No account found with this email address"); return; }
    } else {
      if (!isPhone(forgotInput)) { setForgotError("Enter a valid 10-digit mobile number"); return; }
      found = users.find((u) => u.phone === forgotInput.trim());
      if (!found) { setForgotError("No account found with this mobile number"); return; }
    }

    setLoading(true);
    const otp = makeOtp();
    setGeneratedOtp(otp);
    setForgotTarget(found.email);

    let sent = false;
    if (forgotType === "email") {
      sent = await sendEmailOtp(found.email, otp);
    } else {
      sent = await sendSmsOtp(found.phone, otp);
    }

    setLoading(false);
    if (sent) { switchScreen("otp"); }
    else { setForgotError("Failed to send OTP. Please try again."); }
  };

  // ── OTP VERIFY ────────────────────────────────────────────────
  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otpExpired)              { setOtpError("OTP has expired. Please resend."); return; }
    if (!enteredOtp.trim())      { setOtpError("Please enter the OTP"); return; }
    if (enteredOtp !== generatedOtp) { setOtpError("Incorrect OTP. Please check and try again."); return; }
    setOtpError("");
    switchScreen("reset");
  };

  const handleResendOtp = async () => {
    const otp = makeOtp();
    setGeneratedOtp(otp);
    setEnteredOtp(""); setOtpError(""); setOtpExpired(false);
    const found = users.find((u) => u.email === forgotTarget);
    if (forgotType === "email") await sendEmailOtp(found.email, otp);
    else await sendSmsOtp(found.phone, otp);
    setScreen("otp");
    setTimeout(() => setAnimate(true), 50);
  };

  // ── RESET PASSWORD ────────────────────────────────────────────
  const handleResetPassword = (e) => {
    e.preventDefault();
    setNewPassError("");
    if (!newPass)                  { setNewPassError("New password is required"); return; }
    if (newPass.length < 6)        { setNewPassError("Minimum 6 characters required"); return; }
    if (newPass !== newPassConfirm){ setNewPassError("Passwords do not match"); return; }
    const updated = users.map((u) => u.email === forgotTarget ? { ...u, password: newPass } : u);
    updateUsers(updated);
    setSuccessMsg("✅ Password reset successfully!\n\nYou can now sign in with your new password.");
    switchScreen("success");
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="login-root">
      <div className="orb orb-1"/><div className="orb orb-2"/>
      <div className="orb orb-3"/><div className="orb orb-4"/>
      <div className="grain"/>
      <div className="shape shape-ring"/>
      <div className="shape shape-dot-grid"/>

      <div className={`login-card ${animate ? "card-visible" : ""}`}>

        {/* Brand */}
        <div className="login-brand">
          <div className="brand-icon"><span>⚡</span></div>
          <h1 className="brand-name">TaskFlow</h1>
          <p className="brand-tagline">Organize. Focus. Deliver.</p>
        </div>

        {/* ══ SIGN IN ══ */}
        {screen === "login" && (
          <>
            <div className="screen-badge login-badge">👋 Sign In</div>
            <form onSubmit={handleLogin} noValidate className="login-form">
              {loginErrors.general && <div className="alert-error">{loginErrors.general}</div>}
              <FInput id="l-email" icon="✉️" label="Gmail Address (@gmail.com)"
                type="email" value={loginForm.email} error={loginErrors.email} filled={!!loginForm.email}
                onChange={(v) => { setLoginForm((p)=>({...p,email:v})); setLoginErrors((p)=>({...p,email:""})); }}/>
              <FInput id="l-pass" icon="🔒" label="Password"
                type={showLoginPass?"text":"password"} value={loginForm.password}
                error={loginErrors.password} filled={!!loginForm.password}
                showToggle onToggle={()=>setShowLoginPass(p=>!p)} showPass={showLoginPass}
                onChange={(v)=>{ setLoginForm((p)=>({...p,password:v})); setLoginErrors((p)=>({...p,password:""})); }}/>
              <div className="login-meta">
                <button type="button" className="forgot-btn" onClick={()=>switchScreen("forgot")}>Forgot password?</button>
              </div>
              <SBtn loading={loading} label="Sign In"/>
            </form>

            <div className="social-divider"><span>or</span></div>
            {!showGoogleInput ? (
              <button className="social-btn" type="button" onClick={()=>setShowGoogleInput(true)}>
                <GIcon/> Continue with Google
              </button>
            ) : (
              <form onSubmit={handleGoogleSubmit} className="google-email-form">
                <FInput id="g-email" icon="✉️" label="Enter your Gmail address"
                  type="email" value={googleEmail} error={googleEmailError} filled={!!googleEmail}
                  onChange={(v)=>{ setGoogleEmail(v); setGoogleEmailError(""); }}/>
                <div className="google-form-actions">
                  <button type="button" className="btn-cancel"
                    onClick={()=>{ setShowGoogleInput(false); setGoogleEmail(""); setGoogleEmailError(""); }}>Cancel</button>
                  <SBtn loading={loading} label="Continue" small/>
                </div>
              </form>
            )}

            <p className="signup-link">
              Don't have an account?{" "}
              <button type="button" className="signup-btn" onClick={()=>switchScreen("register")}>Register here</button>
            </p>
          </>
        )}

        {/* ══ REGISTER ══ */}
        {screen === "register" && (
          <>
            <div className="screen-badge register-badge">📝 Create Account</div>
            <form onSubmit={handleRegister} noValidate className="login-form">
              <FInput id="r-name" icon="👤" label="Full Name"
                value={regForm.name} error={regErrors.name} filled={!!regForm.name}
                onChange={(v)=>{ setRegForm((p)=>({...p,name:v})); setRegErrors((p)=>({...p,name:""})); }}/>
              <FInput id="r-email" icon="✉️" label="Gmail Address (@gmail.com)"
                type="email" value={regForm.email} error={regErrors.email} filled={!!regForm.email}
                onChange={(v)=>{ setRegForm((p)=>({...p,email:v})); setRegErrors((p)=>({...p,email:""})); }}/>
              <FInput id="r-phone" icon="📱" label="Mobile Number (10 digits)"
                type="tel" value={regForm.phone} error={regErrors.phone} filled={!!regForm.phone}
                onChange={(v)=>{ setRegForm((p)=>({...p,phone:v})); setRegErrors((p)=>({...p,phone:""})); }}/>
              <FInput id="r-pass" icon="🔒" label="Password (min 6 characters)"
                type={showRegPass?"text":"password"} value={regForm.password}
                error={regErrors.password} filled={!!regForm.password}
                showToggle onToggle={()=>setShowRegPass(p=>!p)} showPass={showRegPass}
                onChange={(v)=>{ setRegForm((p)=>({...p,password:v})); setRegErrors((p)=>({...p,password:""})); }}/>
              <FInput id="r-confirm" icon="🔑" label="Confirm Password"
                type={showRegConfirm?"text":"password"} value={regForm.confirm}
                error={regErrors.confirm} filled={!!regForm.confirm}
                showToggle onToggle={()=>setShowRegConfirm(p=>!p)} showPass={showRegConfirm}
                onChange={(v)=>{ setRegForm((p)=>({...p,confirm:v})); setRegErrors((p)=>({...p,confirm:""})); }}/>
              <SBtn loading={loading} label="Create Account"/>
            </form>
            <p className="signup-link">
              Already have an account?{" "}
              <button type="button" className="signup-btn" onClick={()=>switchScreen("login")}>Sign In</button>
            </p>
          </>
        )}

        {/* ══ FORGOT PASSWORD ══ */}
        {screen === "forgot" && (
          <>
            <div className="screen-badge forgot-badge">🔐 Forgot Password</div>
            <p className="screen-info">Enter your registered Gmail or mobile number. We'll send an OTP to verify it's you.</p>
            <div className="toggle-tabs">
              <button type="button" className={`tab-btn ${forgotType==="email"?"tab-active":""}`}
                onClick={()=>{ setForgotType("email"); setForgotInput(""); setForgotError(""); }}>✉️ Email</button>
              <button type="button" className={`tab-btn ${forgotType==="phone"?"tab-active":""}`}
                onClick={()=>{ setForgotType("phone"); setForgotInput(""); setForgotError(""); }}>📱 Phone</button>
            </div>
            <form onSubmit={handleForgotSubmit} noValidate className="login-form">
              <FInput id="forgot-input"
                icon={forgotType==="email"?"✉️":"📱"}
                label={forgotType==="email"?"Gmail Address (@gmail.com)":"Mobile Number (10 digits)"}
                type={forgotType==="email"?"email":"tel"}
                value={forgotInput} error={forgotError} filled={!!forgotInput}
                onChange={(v)=>{ setForgotInput(v); setForgotError(""); }}/>
              <SBtn loading={loading} label={`Send OTP to ${forgotType==="email"?"Email":"Phone"}`}/>
            </form>
            <p className="signup-link">
              <button type="button" className="signup-btn" onClick={()=>switchScreen("login")}>← Back to Sign In</button>
            </p>
          </>
        )}

        {/* ══ OTP ══ */}
        {screen === "otp" && (
          <>
            <div className="screen-badge otp-badge">🔢 Enter OTP</div>
            <p className="screen-info">
              A 6-digit OTP has been sent to your {forgotType==="email"?"Gmail address":"mobile number"}.
              {forgotType==="email" ? " Please check your inbox (and spam folder)." : " Please check your SMS messages."}
            </p>
            <form onSubmit={handleOtpVerify} noValidate className="login-form">
              <div className={`lf-group ${otpError?"lf-error":""} ${enteredOtp?"lf-filled":""}`}>
                <span className="lf-icon">🔢</span>
                <input type="text" id="otp-box" value={enteredOtp} maxLength={6}
                  onChange={(e)=>{ setEnteredOtp(e.target.value.replace(/\D/g,"")); setOtpError(""); }}
                  placeholder=" " className="otp-input"/>
                <label htmlFor="otp-box">Enter 6-digit OTP</label>
                <div className="lf-glow"/>
                {otpError && <span className="lf-err-msg">{otpError}</span>}
              </div>
              <div className="otp-timer">
                {!otpExpired
                  ? <span>⏱️ OTP expires in <strong>{otpTimer}s</strong></span>
                  : <span className="otp-expired">⚠️ OTP has expired</span>}
              </div>
              <SBtn loading={loading} label="Verify OTP" disabled={otpExpired}/>
              {otpExpired && (
                <button type="button" className="resend-btn" onClick={handleResendOtp}>🔄 Resend OTP</button>
              )}
            </form>
            <p className="signup-link">
              <button type="button" className="signup-btn" onClick={()=>switchScreen("forgot")}>← Change email / phone</button>
            </p>
          </>
        )}

        {/* ══ RESET PASSWORD ══ */}
        {screen === "reset" && (
          <>
            <div className="screen-badge reset-badge">🔑 Set New Password</div>
            <p className="screen-info">Create a strong new password. You can use it to sign in anytime after this.</p>
            <form onSubmit={handleResetPassword} noValidate className="login-form">
              <FInput id="new-p1" icon="🔒" label="New Password (min 6 characters)"
                type={showNewPass?"text":"password"} value={newPass}
                filled={!!newPass} showToggle onToggle={()=>setShowNewPass(p=>!p)} showPass={showNewPass}
                onChange={(v)=>{ setNewPass(v); setNewPassError(""); }}/>
              <FInput id="new-p2" icon="🔑" label="Confirm New Password"
                type={showNewPassConfirm?"text":"password"} value={newPassConfirm}
                filled={!!newPassConfirm} showToggle onToggle={()=>setShowNewPassConfirm(p=>!p)} showPass={showNewPassConfirm}
                onChange={(v)=>{ setNewPassConfirm(v); setNewPassError(""); }}/>
              {newPassError && <div className="alert-error">{newPassError}</div>}
              <SBtn loading={loading} label="Reset Password"/>
            </form>
          </>
        )}

        {/* ══ SUCCESS ══ */}
        {screen === "success" && (
          <div className="success-screen">
            <div className="success-icon">✅</div>
            <p className="success-msg">{successMsg}</p>
            <button className="login-btn" style={{marginTop:"20px"}}
              onClick={()=>{ switchScreen("login"); setRegForm({name:"",email:"",phone:"",password:"",confirm:""}); setRegErrors({}); }}>
              <span>Go to Sign In</span><span className="btn-arrow">→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Reusable Float Input ──────────────────────────────────────
function FInput({ id, icon, label, type="text", value, error, filled, onChange, showToggle, onToggle, showPass }) {
  return (
    <div className={`lf-group ${error?"lf-error":""} ${filled?"lf-filled":""}`}>
      <span className="lf-icon">{icon}</span>
      <input type={type} id={id} value={value} onChange={(e)=>onChange(e.target.value)} placeholder=" " autoComplete="off"/>
      <label htmlFor={id}>{label}</label>
      {showToggle && (
        <button type="button" className="toggle-pass" onClick={onToggle}>{showPass?"🙈":"👁️"}</button>
      )}
      <div className="lf-glow"/>
      {error && <span className="lf-err-msg">{error}</span>}
    </div>
  );
}

// ── Reusable Submit Button ────────────────────────────────────
function SBtn({ loading, label, disabled, small }) {
  return (
    <button type="submit" className={`login-btn ${loading?"loading":""} ${small?"btn-small":""}`} disabled={loading||disabled}>
      {loading ? <span className="btn-loader"/> : <><span>{label}</span><span className="btn-arrow">→</span></>}
    </button>
  );
}

// ── Google Icon ───────────────────────────────────────────────
function GIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.5-2.9-11.3-7.1l-6.5 5C9.8 39.8 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}

export default Login;