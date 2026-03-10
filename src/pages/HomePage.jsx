import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth.slice.js"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.js";

function HomePage() {

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleLogout = async () => {
   await logoutUser();
   dispatch(logout());
   navigate("/login");
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-6">

      {userData ? (
        <>
          <h1 className="text-3xl font-semibold">
            Welcome {userData.fullName}
          </h1>

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-3xl font-semibold text-red-400">
          Please login first
        </h1>
      )}

    </div>
  );
}

export default HomePage;