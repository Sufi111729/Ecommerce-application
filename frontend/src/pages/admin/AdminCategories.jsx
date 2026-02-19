import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createCategory } from "../../api/adminApi.js";

const AdminCategories = () => {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (values) => {
    setMessage("");
    if (!values.name || !values.name.trim()) {
      setMessage("Category name is required");
      return;
    }
    try {
      await createCategory({ name: values.name.trim(), parentId: values.parentId || null });
      reset();
      setMessage("Category created");
    } catch (err) {
      setMessage(err?.response?.data?.error || "Failed to create category");
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input placeholder="Category name" {...register("name")} className="rounded border-ink/20" />
        <input placeholder="Parent ID (optional)" {...register("parentId")} className="rounded border-ink/20" />
        <button className="bg-ink text-white px-4 py-2 rounded">Create</button>
      </form>
      {message && <p className="text-sm mt-3 text-ink/70">{message}</p>}
    </div>
  );
};

export default AdminCategories;
