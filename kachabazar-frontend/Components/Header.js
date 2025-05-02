import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <>


      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="bg-gray-100 text-sm py-2">
          <div className="container mx-auto flex justify-between items-center px-4">
            <ul className="flex space-x-4">
              <li className="flex items-center space-x-1">
                <i className="fa fa-envelope"></i>
              </li>
            </ul>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
                <a href="#"><i className="fa fa-pinterest-p"></i></a>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/img/language.png" alt="Lang" width={20} height={15} />
                <span>English</span>
              </div>
              <Link href="#" className="flex items-center space-x-1">
                <i className="fa fa-user"></i>
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="w-1/4">
            <Link href="/">
              <Image src="/img/logo.png" alt="Logo" width={120} height={50} />
            </Link>
          </div>
          <nav className="w-2/4 hidden md:flex justify-center space-x-6 font-medium">
            <Link href="/" className="text-green-600">Home</Link>
            <Link href="/shop-grid">Shop</Link>
            <div className="relative group">
              <button className="focus:outline-none">Pages</button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-1 py-2 w-40">
                <Link href="/shop-details" className="block px-4 py-2 hover:bg-gray-100">Shop Details</Link>
                <Link href="/shopping-cart" className="block px-4 py-2 hover:bg-gray-100">Shopping Cart</Link>
                <Link href="/checkout" className="block px-4 py-2 hover:bg-gray-100">Check Out</Link>
                <Link href="/blog-details" className="block px-4 py-2 hover:bg-gray-100">Blog Details</Link>
              </div>
            </div>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="w-1/4 flex justify-end items-center space-x-4">
            <Link href="#" className="relative">
              <i className="fa fa-heart"></i>
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">1</span>
            </Link>
            <Link href="#" className="relative">
              <i className="fa fa-shopping-bag"></i>
              <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">3</span>
            </Link>
            <div className="text-sm">
              item: <span className="text-green-600 font-semibold">$150.00</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;