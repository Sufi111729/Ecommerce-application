import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginBuyer, loginSeller, loginModerator } from "../../api/authApi.js";
import { useAuth } from "../../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  role: z.enum(["BUYER", "SELLER", "MODERATOR"]),
  email: z.string().email(),
  password: z.string().min(6)
});

const Login = () => {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "BUYER" }
  });
  const role = watch("role");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      let res;
      if (values.role === "SELLER") res = await loginSeller(values);
      else if (values.role === "MODERATOR") res = await loginModerator(values);
      else res = await loginBuyer(values);
      doLogin(res.data);
      if (res.data.role === "SELLER") navigate("/seller/products");
      else if (res.data.role === "ADMIN") navigate("/admin/reports");
      else if (res.data.role === "MODERATOR") navigate("/moderator/products");
      else navigate("/buyer/orders");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <div className="mb-4">
        <label className="text-sm block mb-2">Login as</label>
        <div className="flex gap-2">
          {["BUYER", "SELLER", "MODERATOR"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setValue("role", r)}
              className={`px-3 py-1 rounded border text-sm ${role === r ? "bg-ink text-white" : "border-ink/20"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <input type="hidden" {...register("role")} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input {...register("email")} className="mt-1 w-full rounded border-ink/20" />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" {...register("password")} className="mt-1 w-full rounded border-ink/20" />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>
        {serverError && <p className="text-sm text-rose-600">{serverError}</p>}
        <button className="bg-ink text-white px-4 py-2 rounded">Sign in</button>
        {role !== "BUYER" && (
          <p className="text-xs text-ink/70">
            {role === "SELLER" ? "Seller login needs approval." : "Moderator login needs admin approval."}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
