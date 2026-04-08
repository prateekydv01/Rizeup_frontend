import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");

    if (token) {
      console.log("TOKEN RECEIVED:", token);

      // ✅ store token
      localStorage.setItem("accessToken", token);
    } else {
      console.log("❌ No token found");
    }

    // 🔐 remove token from URL (important)
    window.history.replaceState({}, document.title, "/");

    // 🚀 redirect to home/dashboard
    navigate("/");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default AuthSuccess;