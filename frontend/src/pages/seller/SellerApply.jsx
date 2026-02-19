import React from "react";
import { useForm } from "react-hook-form";
import { sellerApply } from "../../api/authApi.js";

const SellerApply = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    await sellerApply(values);
    alert("Application submitted");
  };

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Seller Application</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-sm">Shop Name</label>
          <input {...register("shopName")} className="mt-1 w-full rounded border-ink/20" />
        </div>
        <div>
          <label className="text-sm">GST</label>
          <input {...register("gst")} className="mt-1 w-full rounded border-ink/20" />
        </div>
        <button className="bg-ink text-white px-4 py-2 rounded">Apply</button>
      </form>
    </div>
  );
};

export default SellerApply;
