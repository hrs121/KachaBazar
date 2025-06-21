"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { useRouter } from 'next/navigation';
import { formatCurrency } from "@/lib/utils";

const Header = () => {
  const { user, logout } = useUser();
  const { cart, getCartItemCount, getWishlistItemCount } = useCartWishlist();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

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
            <a href="#" className="hover:text-green-600"><i className="fa fa-facebook" /></a>
            <a href="#" className="hover:text-green-600"><i className="fa fa-twitter" /></a>
            <a href="#" className="hover:text-green-600"><i className="fa fa-linkedin" /></a>
            <a href="#" className="hover:text-green-600"><i className="fa fa-instagram" /></a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-gray-700 font-medium">
                  Hi, {user.firstName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <Image src="/img/kachabazar_icon.png" alt="Logo" width={50} height={50} />
          <span className="text-xl font-bold text-green-600">Kacha Bazar</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="px-6 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-6 font-medium text-gray-700">
          <Link href="/home" className="hover:text-green-600">Home</Link>
          
          {user && (
            <Link href="/orders" className="hover:text-green-600">My Orders</Link>
          )}
          
          {user?.category === 'seller' && (
            <>
              <Link href="/seller/dashboard" className="hover:text-green-600">
                Dashboard
              </Link>
              <Link href="/seller/products" className="hover:text-green-600">
                My Products
              </Link>
              <Link href="/seller/add-product" className="hover:text-green-600">
                Add Product
              </Link>
            </>
          )}

          {user?.category === 'admin' && (
            <Link href="/admin/dashboard" className="hover:text-green-600">
              Admin Panel
            </Link>
          )}

          <div className="relative group">
            <button className="hover:text-green-600">Categories</button>
            <div className="absolute left-0 mt-2 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded shadow-md py-2 z-10 min-w-[160px]">
              <Link href="/products?category=vegetables" className="px-4 py-2 hover:bg-gray-100">Vegetables</Link>
              <Link href="/products?category=fruits" className="px-4 py-2 hover:bg-gray-100">Fruits</Link>
              <Link href="/products?category=dairy" className="px-4 py-2 hover:bg-gray-100">Dairy</Link>
              <Link href="/products?category=grains" className="px-4 py-2 hover:bg-gray-100">Grains</Link>
            </div>
          </div>

          <Link href="/contact" className="hover:text-green-600">Contact</Link>
        </nav>        {/* Cart & User Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/wishlist" className="relative text-gray-700 hover:text-red-500">
                <i className="fa fa-heart text-lg" />
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getWishlistItemCount()}
                </span>
              </Link>

              <Link href="/shopping-cart" className="relative text-gray-700 hover:text-green-600">
                <i className="fa fa-shopping-bag text-lg" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-green-600 lg:hidden">
                  <i className="fa fa-user text-lg"></i>
                  <i className="fa fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded shadow-md py-2 z-20 min-w-[160px] lg:hidden">
                  <Link href="/orders" className="px-4 py-2 hover:bg-gray-100 text-sm">
                    <i className="fa fa-list-alt mr-2"></i>My Orders
                  </Link>
                  <Link href="/profile" className="px-4 py-2 hover:bg-gray-100 text-sm">
                    <i className="fa fa-user mr-2"></i>Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 text-sm text-left w-full text-red-600"
                  >
                    <i className="fa fa-sign-out mr-2"></i>Logout
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-700 hidden sm:block">
                Items: <span className="text-green-600 font-semibold">{formatCurrency(cart.totalAmount || 0)}</span>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="px-4 py-2 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden ml-4">
          <i className="fa fa-bars text-xl"></i>
        </button>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="absolute right-0 top-0 px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
