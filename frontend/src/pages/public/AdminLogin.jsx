import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginAdmin } from "../../api/authApi.js";
import { useAuth } from "../../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const AdminLogin = () => {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await loginAdmin(values);
      doLogin(res.data);
      navigate("/admin/reports");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm">Username</label>
          <input {...register("username")} className="mt-1 w-full rounded border-ink/20" />
          {errors.username && <p className="text-xs text-rose-600">{errors.username.message}</p>}
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" {...register("password")} className="mt-1 w-full rounded border-ink/20" />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>
        {serverError && <p className="text-sm text-rose-600">{serverError}</p>}
        <button className="bg-ink text-white px-4 py-2 rounded">Sign in</button>
      </form>
    </div>
  );
};

export default AdminLogin;
