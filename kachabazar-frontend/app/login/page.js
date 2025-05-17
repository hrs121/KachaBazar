"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    // remember: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
        setForm({ email: "", password: "" });
        return;
      }

      // const data = await response.json();
      // console.log("Login success:", data);
      router.push('/');
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setForm({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Type your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div> */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign up
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
