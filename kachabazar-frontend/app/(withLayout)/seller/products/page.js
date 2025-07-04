"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { sellerAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

const SellerProducts = () => {
  const { user } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.category !== 'seller') {
      router.push('/home');
      return;
    }

    fetchProducts();
  }, [user, router]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await sellerAPI.getMyProducts({ page, limit: 10 });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      category: product.category,
      tags: product.tags ? product.tags.join(', ') : '',
      unit: product.unit,
      image: product.image,
      featured: product.featured || false
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleSaveEdit = async (productId) => {
    try {
      const updateData = {
        ...editForm,
        price: parseFloat(editForm.price),
        originalPrice: parseFloat(editForm.originalPrice),
        stock: parseInt(editForm.stock),
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await sellerAPI.updateProduct(productId, updateData);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      setEditForm({});
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  };

  const handleDelete = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    try {
      await sellerAPI.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!user || user.category !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Seller only.</p>
          <Link href="/home" className="text-green-600 hover:text-green-700 mt-2 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/seller/dashboard" className="flex items-center">
                <img src="/img/kachabazar_icon.png" alt="KachaBazar" className="w-10 h-10" />
                <span className="text-xl font-bold text-green-600 ml-2">KachaBazar</span>
              </Link>
              <span className="ml-4 text-gray-500">|</span>
              <span className="ml-4 text-lg font-semibold text-gray-700">My Products</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/seller/add-product"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Add Product
              </Link>
              <Link
                href="/seller/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product listings - {products.length} products found
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <Link
                href="/seller/add-product"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      {editingProduct === product._id ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 mr-4">
                                <Image
                                  src={product.image || '/img/product/default-product.jpg'}
                                  alt={product.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  name="title"
                                  value={editForm.title}
                                  onChange={handleInputChange}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              name="category"
                              value={editForm.category}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="vegetables">Vegetables</option>
                              <option value="fruits">Fruits</option>
                              <option value="dairy">Dairy</option>
                              <option value="meat">Meat</option>
                              <option value="fish">Fish</option>
                              <option value="grains">Grains</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              name="price"
                              value={editForm.price}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              name="stock"
                              value={editForm.stock}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(product._id)}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 mr-4">
                                <Image
                                  src={product.image || '/img/product/default-product.jpg'}
                                  alt={product.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                <div className="text-sm text-gray-500">{product.unit}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.originalPrice)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{product.stock}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product._id, product.title)}
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </div>
                <div className="flex space-x-2">
                  {pagination.page > 1 && (
                    <button
                      onClick={() => fetchProducts(pagination.page - 1)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Previous
                    </button>
                  )}
                  {pagination.page < pagination.pages && (
                    <button
                      onClick={() => fetchProducts(pagination.page + 1)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
