import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerBuyer, registerSeller, registerModerator } from "../../api/authApi.js";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  role: z.enum(["BUYER", "SELLER", "MODERATOR"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  shopName: z.string().optional(),
  gst: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.role === "SELLER") {
    if (!data.shopName || data.shopName.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["shopName"], message: "Shop name is required" });
    }
  }
});

const Register = () => {
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
      if (values.role === "SELLER") {
        await registerSeller(values);
      } else if (values.role === "MODERATOR") {
        await registerModerator(values);
      } else {
        await registerBuyer(values);
      }
      navigate("/login");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      <div className="mb-4">
        <label className="text-sm block mb-2">Register as</label>
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
          <label className="text-sm">Name</label>
          <input {...register("name")} className="mt-1 w-full rounded border-ink/20" />
          {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input {...register("email")} className="mt-1 w-full rounded border-ink/20" />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <input {...register("phone")} className="mt-1 w-full rounded border-ink/20" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" {...register("password")} className="mt-1 w-full rounded border-ink/20" />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>
        {role === "SELLER" && (
          <>
            <div>
              <label className="text-sm">Shop Name</label>
              <input {...register("shopName")} className="mt-1 w-full rounded border-ink/20" />
              {errors.shopName && <p className="text-xs text-rose-600">{errors.shopName.message}</p>}
            </div>
            <div>
              <label className="text-sm">GST (optional)</label>
              <input {...register("gst")} className="mt-1 w-full rounded border-ink/20" />
            </div>
          </>
        )}
        {serverError && <p className="text-sm text-rose-600">{serverError}</p>}
        <button className="bg-ink text-white px-4 py-2 rounded">Create account</button>
        {role !== "BUYER" && (
          <p className="text-xs text-ink/70">
            {role === "SELLER" ? "Seller accounts need approval before login." : "Moderator accounts need admin approval before login."}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
