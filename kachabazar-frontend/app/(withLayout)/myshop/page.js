"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/Header";

const SellerDashboard = () => {
  const seller = {
    shopName: "GreenFresh Mart",
    logo: "/img/featured/feature-7.jpg",
    contactEmail: "greenfresh@gmail.com",
    contactPhone: "01712345678",
  };

  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 120,
      image: "/img/featured/feature-1.jpg",
      stock: 25,
      status: "active",
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: 80,
      image: "/img/featured/feature-2.jpg",
      stock: 12,
      status: "active",
    },
    {
      id: 3,
      name: "Raw Honey",
      price: 350,
      image: "/img/featured/feature-5.jpg",
      stock: 5,
      status: "inactive",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Shop Info */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={seller.logo} alt="Shop Logo" width={60} height={60} className="rounded-full border" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{seller.shopName}</h2>
                <p className="text-sm text-gray-500">{seller.contactEmail} | {seller.contactPhone}</p>
              </div>
            </div>
            <Link href="/seller/edit-shop" className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Edit Shop
            </Link>
          </div>
        </div>

        {/* Product Overview */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Products</h3>
          <Link href="/addproduct" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            + Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <Image src={product.image} alt={product.name} width={300} height={200} className="rounded-md object-cover w-full h-40" />
              <h4 className="mt-3 text-lg font-semibold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-500">৳ {product.price}</p>
              <div className="mt-2 text-sm">
                Stock: <span className={product.stock > 10 ? "text-green-600" : "text-red-600"}>{product.stock}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-medium px-2 py-1 rounded ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {product.status}
                </span>
                <Link href={`/seller/products/${product.id}`} className="text-sm text-indigo-600 hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
