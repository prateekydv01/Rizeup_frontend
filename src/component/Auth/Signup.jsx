import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/auth.slice.js";
import { registerUser, getCurrentUser } from '../../api/auth';
import { useForm } from "react-hook-form";
import { api } from "../../api/index.js";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);

  const signup = async (data) => {
    setError("");
    setLoading(true);
    try {
      await registerUser(data);
      const response = await getCurrentUser();
      const userData = response.data.data;
      if (userData) dispatch(authLogin({ userData }));
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const res = await api.get("/google/auth/url");
      window.location.href = res.data.data.url;
    } catch (err) {
      setError("Failed to connect to Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#080809", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .rizeup-input { background: rgba(24,24,27,0.8); border: 1px solid rgba(39,39,42,0.9); color: #d4d4d8; transition: border-color 0.2s; }
        .rizeup-input::placeholder { color: #3f3f46; }
        .rizeup-input:focus { outline: none; border-color: rgba(249,115,22,0.45); }
        .rizeup-input:-webkit-autofill,
        .rizeup-input:-webkit-autofill:hover,
        .rizeup-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #111113 inset;
          -webkit-text-fill-color: #d4d4d8;
          caret-color: #d4d4d8;
        }
        .field-error { color: #f87171; font-size: 10px; margin-top: 4px; }
        .google-btn { transition: background 0.2s, border-color 0.2s, transform 0.1s; }
        .google-btn:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(82,82,91,0.8) !important; }
        .google-btn:active { transform: scale(0.98); }
      `}</style>

      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm">
        {/* Top accent line */}
        <div className="h-[1.5px] w-full rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent, #f97316 40%, #ef4444 70%, transparent)" }} />

        <div className="rounded-b-2xl rounded-tr-2xl px-8 pt-8 pb-8"
          style={{ background: "linear-gradient(145deg, #111113 0%, #0e0e10 100%)", border: "1px solid rgba(39,39,42,0.9)", borderTop: "none", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white flex-shrink-0"
              style={{ fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg, #f97316, #dc2626)", fontSize: "15px" }}>
              R
            </div>
            <span className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Rize<span style={{ color: "#f97316" }}>Up</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="font-black tracking-tight text-white mb-1" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem" }}>
              Start rising
            </h2>
            <p className="text-xs tracking-wide" style={{ color: "#52525b" }}>Create your account and build your streak.</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="google-btn w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(63,63,70,0.7)", color: "#d4d4d8" }}
          >
            {googleLoading ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#d4d4d8" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(39,39,42,0.8)" }} />
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "#3f3f46" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(39,39,42,0.8)" }} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2"
              style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <circle cx="6" cy="6" r="5.5" stroke="#f87171" strokeWidth="1"/>
                <path d="M6 4v2.5M6 8h.01" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(signup)}>
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Full Name</label>
                <input type="text" placeholder="Your full name"
                  {...register("fullName", { required: true })}
                  className="rizeup-input w-full rounded-xl px-3.5 py-2.5 text-sm" />
                {errors.fullName && <p className="field-error">Full name is required</p>}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Username</label>
                <input type="text" placeholder="YourHandle"
                  {...register("username", { required: true })}
                  className="rizeup-input w-full rounded-xl px-3.5 py-2.5 text-sm" />
                {errors.username && <p className="field-error">Username is required</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Email</label>
                <input type="email" placeholder="you@example.com"
                  {...register("email", { required: true })}
                  className="rizeup-input w-full rounded-xl px-3.5 py-2.5 text-sm" />
                {errors.email && <p className="field-error">Email is required</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                    {...register("password", { required: true })}
                    className="rizeup-input w-full rounded-xl px-3.5 py-2.5 pr-16 text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest uppercase transition-colors duration-150"
                    style={{ color: "#52525b" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
                    onMouseLeave={e => e.currentTarget.style.color = "#52525b"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="field-error">Password is required</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-200 mt-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg, #f97316, #dc2626)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                      <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(39,39,42,0.8)" }} />
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "#3f3f46" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(39,39,42,0.8)" }} />
          </div>

          <p className="text-center text-xs" style={{ color: "#52525b" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold transition-colors duration-150" style={{ color: "#f97316" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
              onMouseLeave={e => e.currentTarget.style.color = "#f97316"}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;