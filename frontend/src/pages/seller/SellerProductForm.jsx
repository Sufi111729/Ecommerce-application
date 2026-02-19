import React from "react";
import { useForm } from "react-hook-form";
import { createProduct, submitProduct } from "../../api/productApi.js";

const SellerProductForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    const payload = {
      categoryId: Number(values.categoryId),
      title: values.title,
      description: values.description,
      images: values.images ? values.images.split(",").map((v) => v.trim()) : [],
      variants: [
        {
          sku: values.sku,
          attributesJson: values.attributesJson || "{}",
          price: Number(values.price),
          mrp: Number(values.mrp || values.price),
          stockQty: Number(values.stockQty)
        }
      ]
    };
    const res = await createProduct(payload);
    await submitProduct(res.data.id);
    alert("Product submitted for approval");
  };

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input placeholder="Category ID" {...register("categoryId")} className="rounded border-ink/20" />
        <input placeholder="Title" {...register("title")} className="rounded border-ink/20" />
        <textarea placeholder="Description" {...register("description")} className="rounded border-ink/20" />
        <input placeholder="Image URLs (comma separated)" {...register("images")} className="rounded border-ink/20" />
        <input placeholder="SKU" {...register("sku")} className="rounded border-ink/20" />
        <input placeholder="Attributes JSON" {...register("attributesJson")} className="rounded border-ink/20" />
        <input placeholder="Price" {...register("price")} className="rounded border-ink/20" />
        <input placeholder="MRP" {...register("mrp")} className="rounded border-ink/20" />
        <input placeholder="Stock Qty" {...register("stockQty")} className="rounded border-ink/20" />
        <button className="bg-ink text-white px-4 py-2 rounded">Save & Submit</button>
      </form>
    </div>
  );
};

export default SellerProductForm;
