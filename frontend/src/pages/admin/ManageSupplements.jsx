import React, { useEffect, useState } from 'react';
import API from '../../api';
import AdminLayout from '../../components/AdminLayout';

export default function ManageSupplements() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, visible, hidden
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from /admin/products...');
      const res = await API.get('/admin/products');
      console.log('API Response:', res.data);
      console.log('Products count:', res.data.products?.length || 0);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert(`Error loading products: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (productId, currentStatus) => {
    const action = currentStatus ? 'hide' : 'show';
    if (!window.confirm(`${action === 'hide' ? 'Hide' : 'Show'} this supplement on user site?`)) return;
    try {
      if (action === 'hide') {
        await API.put(`/admin/products/${productId}/reject`);
      } else {
        await API.put(`/admin/products/${productId}/approve`);
      }
      await loadProducts();
    } catch (err) {
      alert('Error updating product visibility');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`⚠️ PERMANENTLY DELETE "${productName}"?\n\nThis action cannot be undone!\n\nThe product will be removed from:\n- Database\n- User shop\n- All orders history\n\nAre you absolutely sure?`)) {
      return;
    }

    // Double confirmation for safety
    const confirmText = prompt(`Type "DELETE" to confirm permanent deletion of "${productName}":`);
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled. Product name must match exactly.');
      return;
    }

    try {
      await API.delete(`/admin/products/${productId}`);
      alert('Product permanently deleted!');
      await loadProducts();
    } catch (err) {
      alert('Error deleting product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct._id}`, productData);
      } else {
        await API.post('/admin/products', productData);
      }
      setEditingProduct(null);
      setShowAddForm(false);
      await loadProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'visible') return p.approved;
    if (filter === 'hidden') return !p.approved;
    return true;
  });

  // Group products by brand
  const groupedByBrand = filteredProducts.reduce((acc, product) => {
    const brand = product.brand || 'Unassigned';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {});

  // Sort products within each brand
  Object.keys(groupedByBrand).forEach(brand => {
    groupedByBrand[brand].sort((a, b) => a.name.localeCompare(b.name));
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading supplements...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setFilter('visible')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'visible'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Visible on Site ({products.filter(p => p.approved).length})
            </button>
            <button
              onClick={() => setFilter('hidden')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'hidden'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Hidden ({products.filter(p => !p.approved).length})
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Supplement
          </button>
        </div>

        {/* Products Grouped by Brand */}
        {Object.keys(groupedByBrand).sort().map((brand) => (
          <div key={brand} className="mb-12">
            {/* Brand Header */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{brand}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">{groupedByBrand[brand].length} products</p>
              <div className="max-w-xs mx-auto h-px bg-gray-300"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByBrand[brand].map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => handleToggleVisibility(product._id, product.approved)}
                          className={`p-1.5 rounded-lg transition-all ${
                            product.approved
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={product.approved ? 'Visible on user site - Click to hide' : 'Hidden from users - Click to show'}
                        >
                          {product.approved ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.066 5.717m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.approved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.approved ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">{product.brand} • {product.category}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                      <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(product._id, product.approved)}
                        className={`flex-1 px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-1 ${
                          product.approved
                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {product.approved ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.066 5.717m0 0L21 21" />
                            </svg>
                            Hide
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Show
                          </>
                        )}
                      </button>
                    </div>

                    {/* Delete Button - Separate row for emphasis */}
                    <div className="mt-2">
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all text-xs font-medium flex items-center justify-center gap-1 border border-red-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No supplements found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter or add a new supplement</p>
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Refresh Products
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Check browser console (F12) for error details
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(editingProduct || showAddForm) && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setEditingProduct(null);
            setShowAddForm(false);
          }}
        />
      )}
    </AdminLayout>
  );
}

// Product Form Modal Component
function ProductFormModal({ product, onSave, onClose }) {
  const [formData, setFormData] = useState(product || {
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    stock: '',
    features: [],
    approved: true
  });

  const [featureInput, setFeatureInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const [uploadError, setUploadError] = useState('');
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [existingBrands, setExistingBrands] = useState([]);

  // Predefined brands
  const predefinedBrands = [
    'MuscleBlaze',
    'MuscleTech',
    'MyProtein',
    'Nutrabay',
    'Optimum Nutrition'
  ];

  // Load existing brands from products
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await API.get('/admin/products');
        const brands = [...new Set(res.data.products.map(p => p.brand))].sort();
        setExistingBrands(brands);
      } catch (err) {
        console.error('Error loading brands:', err);
      }
    };
    loadBrands();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError('');
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image for new products
    if (!product && !imageFile && !formData.imageUrl) {
      setUploadError('Please upload a product image');
      return;
    }

    let imageUrl = formData.imageUrl;

    // Handle file upload
    if (imageFile) {
      try {
        setUploadError('Uploading image...');
        
        // Generate filename: brandname-productname-timestamp.jpg
        const timestamp = Date.now();
        const brandSlug = formData.brand.toLowerCase().replace(/\s+/g, '-');
        const nameSlug = formData.name.toLowerCase().replace(/\s+/g, '-').substring(0, 30);
        const extension = imageFile.name.split('.').pop();
        const filename = `${brandSlug}-${nameSlug}-${timestamp}.${extension}`;

        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        const imageData = await base64Promise;

        // Upload to backend
        const uploadResponse = await API.post('/admin/upload-image', {
          imageData,
          filename
        });

        imageUrl = uploadResponse.data.imageUrl;
        setUploadError('');
        
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError('Error uploading image. Please try again.');
        return;
      }
    }

    onSave({
      ...formData,
      imageUrl,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || undefined,
      stock: Number(formData.stock),
      approved: true, // Ensure new products are always approved
      isActive: true  // Ensure products are active
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {product ? 'Edit Supplement' : 'Add New Supplement'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              {!showNewBrandInput ? (
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      required
                      value={formData.brand}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setShowNewBrandInput(true);
                          setFormData({ ...formData, brand: '' });
                        } else {
                          setFormData({ ...formData, brand: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      <option value="" className="text-gray-500">Select a brand...</option>
                      {existingBrands.map(brand => (
                        <option key={brand} value={brand} className="py-2">{brand}</option>
                      ))}
                      <option value="__new__" className="font-semibold text-blue-600 py-2">+ Add New Brand</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter new brand name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewBrandInput(false);
                      setFormData({ ...formData, brand: '' });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to brand list
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image {!product && '*'}
            </label>
            
            {/* Upload Container */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center justify-center">
                {imagePreview ? (
                  // Image Preview
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-contain rounded-lg border border-gray-200 mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(product?.imageUrl || '');
                        setUploadError('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  // Upload Icon
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-2 text-center">
                  {imagePreview ? 'Change image' : 'Click to select or drag an image'}
                </p>
                <p className="text-xs text-gray-500 mb-3">JPG, PNG, or WEBP (max 5MB)</p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  required={!product && !imagePreview}
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium"
                >
                  Choose Image
                </label>
                
                {uploadError && (
                  <p className="text-xs text-red-600 mt-2">{uploadError}</p>
                )}
              </div>
            </div>
            
            {product && !imageFile && (
              <p className="text-xs text-gray-500 mt-2">
                Leave empty to keep current image
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.features || []).map((feature, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              {product ? 'Update Supplement' : 'Add Supplement'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
