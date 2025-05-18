"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

const AddProductPage = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: null,
    tags: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      return setMessage("Image is required");
    }

    try {
      // 1. Upload image to /public/img/product folder
      const formData = new FormData();
      formData.append("image", form.image);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const { imagePath } = await uploadRes.json();

      const productData = {
        title: form.title,
        price: parseFloat(form.price),
        image: imagePath,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        email: user?.email || "guest@example.com",
      };

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setMessage("Product added successfully!");
      setForm({ title: "", price: "", image: null, tags: "" });
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Add Product
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;
