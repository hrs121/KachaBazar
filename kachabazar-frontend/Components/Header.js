"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-gray-100 text-sm py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-4 text-gray-600">
            <i className="fa fa-envelope" />
            <span>support@kachabazar.com</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <a href="#"><i className="fa fa-facebook" /></a>
            <a href="#"><i className="fa fa-twitter" /></a>
            <a href="#"><i className="fa fa-linkedin" /></a>
            <a href="#"><i className="fa fa-instagram" /></a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-gray-700 font-medium">
                  Hi, {user.firstName}
                </span>
                <Link href="/logout" className="text-indigo-600 hover:underline">
                  Logout
                </Link>
              </div>
            ) : (
              <Link href="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/kachabazar_icon.png" alt="Logo" width={50} height={50} />
          <span className="text-xl font-bold text-green-600">Kacha Bazar</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
          <Link href="/home" className="hover:text-green-600">Home</Link>
          <Link href="/myshop" className="hover:text-green-600">Shop</Link>

          <div className="relative group">
            <button className="hover:text-green-600">Pages</button>
            <div className="absolute left-0 mt-2 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded shadow-md py-2 z-10 min-w-[160px]">
              <Link href="/shop-details" className="px-4 py-2 hover:bg-gray-100">Shop Details</Link>
              <Link href="/shopping-cart" className="px-4 py-2 hover:bg-gray-100">Shopping Cart</Link>
              <Link href="/checkout" className="px-4 py-2 hover:bg-gray-100">Checkout</Link>
              <Link href="/blog-details" className="px-4 py-2 hover:bg-gray-100">Blog Details</Link>
            </div>
          </div>

          <Link href="/blog" className="hover:text-green-600">Blog</Link>
          <Link href="/contact" className="hover:text-green-600">Contact</Link>
        </nav>

        {/* Cart & Wishlist */}
        <div className="flex items-center gap-5">
          <Link href="#" className="relative text-gray-700 hover:text-red-500">
            <i className="fa fa-heart text-lg" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
          </Link>

          <Link href="#" className="relative text-gray-700 hover:text-green-600">
            <i className="fa fa-shopping-bag text-lg" />
            <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </Link>

          <div className="text-sm text-gray-700 hidden sm:block">
            Items: <span className="text-green-600 font-semibold">$150.00</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
