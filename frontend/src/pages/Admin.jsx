import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productAPI, orderAPI } from '../services/api';

const Admin = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    brand: '',
    isFeatured: false
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    } else {
      if (activeTab === 'products') {
        fetchProducts();
      } else {
        fetchOrders();
      }
    }
  }, [isAuthenticated, isAdmin, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllAdmin();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProductForm({
      ...productForm,
      [e.target.name]: value
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock)
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        await productAPI.create(productData);
        alert('Product created successfully!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        brand: '',
        isFeatured: false
      });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      brand: product.brand,
      isFeatured: product.isFeatured
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      alert('Order status updated!');
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="admin-page">
      <h1 className="text-4xl font-bold mb-8" data-testid="admin-heading">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-6 font-semibold transition ${
            activeTab === 'products'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          data-testid="products-tab"
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-6 font-semibold transition ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          data-testid="orders-tab"
        >
          Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Products</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  image: '',
                  stock: '',
                  brand: '',
                  isFeatured: false
                });
                setShowProductForm(!showProductForm);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
              data-testid="add-product-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    data-testid="product-name-input"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    data-testid="product-brand-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                    required
                    data-testid="product-description-input"
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    data-testid="product-price-input"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    data-testid="product-stock-input"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    data-testid="product-category-input"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={productForm.image}
                    onChange={handleProductFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    data-testid="product-image-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={productForm.isFeatured}
                      onChange={handleProductFormChange}
                      className="mr-2"
                      data-testid="product-featured-checkbox"
                    />
                    <span className="font-medium">Featured Product</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  data-testid="save-product-button"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Products List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id} data-testid="product-row">
                      <td className="px-6 py-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-700"
                            data-testid="edit-product-button"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                            data-testid="delete-product-button"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
{activeTab === 'orders' && (
  <div>
    <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

    {loading ? (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ) : (
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow p-6"
            data-testid="order-row"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  Order #{order._id.slice(-6)}
                </h3>

                <p className="text-sm text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600">
                  User: {order.userInfo?.name || 'N/A'}
                </p>

                <p className="text-sm text-gray-600">
                  Email: {order.userInfo?.email || 'N/A'}
                </p>

                <p className="text-sm text-gray-600">
                  Address:{" "}
                  {order.shippingAddress?.street},{" "}
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </p>

                <p className="font-semibold mt-2">
                  Total: ₹{order.totalAmount}
                </p>
              </div>

              {/* STATUS UPDATE */}
              <div>
                <label className="block text-sm mb-2 font-medium">
                  Update Status
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order._id, e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Items:</h4>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 ml-4"
                >
                  • {item.name} × {item.quantity} — ₹{item.price}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default Admin;
