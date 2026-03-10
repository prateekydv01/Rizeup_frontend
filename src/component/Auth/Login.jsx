import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../../store/auth.slice.js";
import { useDispatch } from "react-redux";
import { loginUser, getCurrentUser } from "../../api/auth";
import { useForm } from "react-hook-form";

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const session = await loginUser(data);

      if (session) {
        const response = await getCurrentUser();
        const userData = response.data.data;

        if (userData) {
          dispatch(authLogin({ userData }));
        }

        navigate("/");
      }

    } catch (error) {

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-950">

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h2>

        {error && (
          <div className="bg-red-900 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-4">

          {/* Email */}

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              {...register("email", { required: true })}
              className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}

          <div>

            <label className="block text-sm text-gray-400 mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", { required: true })}
                className="w-full p-2.5 pr-16 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-5">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;