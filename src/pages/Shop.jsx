import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BuyNowModal from '../components/BuyNowModal';
import { calculateDiscountedPrice, getDiscountLabel, getMembershipUpgradeMessage } from '../utils/discountHelper';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [buyNowModal, setBuyNowModal] = useState({ isOpen: false, product: null });
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const brandRefs = useRef({});
  const cardRefs = useRef({});
  const navigate = useNavigate();
  const { cart, addToCart, buyNow, getCartTotal } = useCart();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId;
            setVisibleCards((prev) => new Set([...prev, cardId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [groupedProducts]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    groupProductsByBrand();
  }, [products, selectedBrand, selectedCategory]);

  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error loading products:', err);
      // Use mock data when backend is not available
      setProducts([
        {
          _id: '1',
          name: 'Whey Protein Powder',
          brand: 'FitLife',
          category: 'Protein',
          price: 2999,
          image: '/images/whey-protein.jpg',
          description: 'High-quality whey protein for muscle building',
          stock: 50
        },
        {
          _id: '2',
          name: 'Creatine Monohydrate',
          brand: 'FitLife',
          category: 'Performance',
          price: 1499,
          image: '/images/creatine.jpg',
          description: 'Pure creatine for enhanced performance',
          stock: 30
        },
        {
          _id: '3',
          name: 'BCAA Capsules',
          brand: 'FitLife',
          category: 'Recovery',
          price: 1999,
          image: '/images/bcaa.jpg',
          description: 'Essential amino acids for recovery',
          stock: 25
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const groupProductsByBrand = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    const grouped = filtered.reduce((acc, product) => {
      const brand = product.brand || 'Unassigned';
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(product);
      return acc;
    }, {});

    Object.keys(grouped).forEach(brand => {
      grouped[brand].sort((a, b) => a.name.localeCompare(b.name));
    });

    setGroupedProducts(grouped);
  };

  const scrollToBrand = (brand) => {
    setSelectedBrand(brand);
    if (brand !== 'all' && brandRefs.current[brand]) {
      brandRefs.current[brand].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product, quantity) => {
    // Check if cart has items
    if (cart.length > 0) {
      // Show confirmation modal
      setBuyNowModal({ isOpen: true, product, quantity });
    } else {
      // Cart is empty, proceed directly
      buyNow(product, quantity);
      navigate('/checkout');
    }
  };

  const handleBuyNowProceed = () => {
    const { product, quantity } = buyNowModal;
    buyNow(product, quantity);
    setBuyNowModal({ isOpen: false, product: null });
    navigate('/checkout');
  };

  const handleBuyNowKeepCart = () => {
    const { product, quantity } = buyNowModal;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      // Increase quantity by the specified amount
      addToCart(product, quantity);
    } else {
      // Add new item
      addToCart(product, quantity);
    }
    
    setBuyNowModal({ isOpen: false, product: null });
    navigate('/checkout');
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const brands = ['all', ...new Set(products.map(p => p.brand))].sort();
  const categories = ['all', ...new Set(products.map(p => p.category))].sort();

  const getBrandIcon = (brand) => {
    const icons = {
      'MuscleBlaze': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      'MuscleTech': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      'MyProtein': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      'Nutrabay': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      'Optimum Nutrition': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      'Unassigned': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    };
    return icons[brand] || icons['Unassigned'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplements...</p>
        </div>
      </div>
    );
  }

  const totalProducts = Object.values(groupedProducts).reduce((sum, products) => sum + products.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center overflow-hidden">
          <h1 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Supplements Store
          </h1>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-blue-600 transition-all duration-[1500ms] ease-out delay-300 ${isVisible ? 'w-48' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-gray-600 max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Premium quality supplements from our trusted brand partners
          </p>
        </div>

        {/* Filter Toggle Button */}
        <div className={`mb-6 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-blue-500"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-semibold text-gray-700">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter Options
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Brand</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => scrollToBrand('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedBrand === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Brands
                </button>
                {brands.filter(b => b !== 'all').map(brand => (
                  <button
                    key={brand}
                    onClick={() => scrollToBrand(brand)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedBrand === brand
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Showing {totalProducts} of {products.length} products
            </div>
          </div>
        )}

        {/* Brand Sections */}
        {Object.keys(groupedProducts).sort().map((brand, brandIndex) => (
          <div
            key={brand}
            ref={el => brandRefs.current[brand] = el}
            className={`mb-16 scroll-mt-32 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${400 + brandIndex * 100}ms` }}
          >
            {/* Brand Header - Centered */}
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                  {getBrandIcon(brand)}
                </div>
                <h2 className="text-4xl font-bold text-gray-900">{brand}</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Premium supplements for your fitness goals</p>
              <div className="max-w-xs mx-auto h-px bg-gray-300"></div>
            </div>

            {/* Products Grid - 4 on top, 3 centered below */}
            <div className="flex flex-col items-center gap-6">
              {/* First Row - 4 products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {groupedProducts[brand].slice(0, 4).map((product, index) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onImageClick={() => setSelectedImage(product)}
                    index={index}
                    cardId={`${brand}-${product._id}`}
                    isVisible={visibleCards.has(`${brand}-${product._id}`)}
                    cardRef={(el) => cardRefs.current[`${brand}-${product._id}`] = el}
                  />
                ))}
              </div>

              {/* Second Row - 3 products centered */}
              {groupedProducts[brand].length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                  {groupedProducts[brand].slice(4, 7).map((product, index) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onImageClick={() => setSelectedImage(product)}
                      index={index + 4}
                      cardId={`${brand}-${product._id}`}
                      isVisible={visibleCards.has(`${brand}-${product._id}`)}
                      cardRef={(el) => cardRefs.current[`${brand}-${product._id}`] = el}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* No Products Found */}
        {totalProducts === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}

        {/* Cart Floating Button - Always Visible */}
        <Link
          to={getCartTotal() > 0 ? "/checkout" : "/cart"}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-blue-700 transition-all duration-300 z-50"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCartTotal() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {getCartTotal()}
              </span>
            )}
          </div>
        </Link>

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedImage.name}</h3>
                  <p className="text-sm text-gray-600">{selectedImage.brand}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.name}
                  className="max-h-96 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Buy Now Confirmation Modal */}
        <BuyNowModal
          isOpen={buyNowModal.isOpen}
          onClose={() => setBuyNowModal({ isOpen: false, product: null })}
          onProceed={handleBuyNowProceed}
          onKeepCart={handleBuyNowKeepCart}
          productName={buyNowModal.product?.name || ''}
        />
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart, onBuyNow, onImageClick, index, cardId, isVisible, cardRef }) {
  const { cart, updateQuantity, addToCart } = useCart();
  const [isFlipped, setIsFlipped] = useState(false);
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  
  const isElite = user?.membership?.plan === 'elite';
  const membershipPlan = user?.membership?.plan || 'free';
  
  // Calculate discounted price
  const discountedPrice = calculateDiscountedPrice(product.price, membershipPlan);
  const discountLabel = getDiscountLabel(membershipPlan);
  const hasDiscount = membershipPlan !== 'free';
  
  // Get current quantity from cart
  const cartItem = cart.find(item => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      // Remove from cart
      updateQuantity(product._id, 0);
    } else if (newQuantity <= product.stock) {
      if (quantity === 0) {
        // Item not in cart yet, add it
        addToCart(product, newQuantity);
      } else {
        // Item already in cart, update quantity
        updateQuantity(product._id, newQuantity);
      }
    }
  };

  const handleBuyNowClick = () => {
    const buyQuantity = quantity > 0 ? quantity : 1;
    onBuyNow(product, buyQuantity);
  };

  return (
    <div 
      ref={cardRef}
      data-card-id={cardId}
      className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of Card */}
        <div 
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
      {/* Product Image */}
      <div 
        className="h-56 bg-gray-50 overflow-hidden relative cursor-pointer group"
        onClick={() => onImageClick(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Brand */}
        <div className="text-xs font-semibold text-blue-600 mb-2">{product.brand}</div>

        {/* Name */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>

        {/* Category */}
        <div className="mb-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 mt-auto">
          {hasDiscount ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                <span className="text-2xl font-bold text-gray-900">₹{Math.round(discountedPrice)}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-green-600">{discountLabel}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
                <p className="text-xs text-green-700 font-medium">
                  You're saving ₹{Math.round(product.price - discountedPrice)} on this item!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">With Pro (4%):</span>
                  <span className="font-bold text-blue-600">₹{Math.round(product.price * 0.96)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">With Elite (10%):</span>
                  <span className="font-bold text-purple-600">₹{Math.round(product.price * 0.90)}</span>
                </div>
                <div className="pt-1 border-t border-blue-200">
                  <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Save up to ₹{Math.round(product.price * 0.10)} with Elite!
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-red-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Out of Stock
          </div>
        )}

        {/* Quantity Selector */}
        {product.stock > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border-2 border-gray-200 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity === 0}
                className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-1 font-semibold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (quantity > 0) {
                  onAddToCart(product, quantity);
                }
              }}
              disabled={product.stock === 0 || quantity === 0}
              className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              title={quantity === 0 ? 'Select quantity first' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {quantity === 0 ? 'Select Qty' : 'Add'}
            </button>
            <button
              onClick={handleBuyNowClick}
              disabled={product.stock === 0}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.03] hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Buy Now
            </button>
          </div>
          
          {/* View Description Button */}
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Description
          </button>
        </div>
      </div>

      {/* Out of Stock Overlay */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
            <p className="font-bold text-gray-900">Out of Stock</p>
          </div>
        </div>
      )}
    </div>

        {/* Back of Card - Description */}
        <div 
          className="absolute inset-0 bg-white rounded-2xl shadow-md p-5 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {isElite ? (
            // Elite User - Full Description
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-xs font-semibold text-blue-600 mb-3">{product.brand} • {product.category}</div>

              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{product.description}</p>

              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Back to Product
                </button>
              </div>
            </>
          ) : (
            // Non-Elite User - Locked Description
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Elite Members Only</h4>
                <p className="text-sm text-gray-600 mb-6 max-w-xs">
                  Unlock detailed supplement insights, benefits, and usage instructions with Elite Membership
                </p>
                <Link
                  to="/membership"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Upgrade to Elite
                </Link>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Back to Product
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


{/* CSS Animations */}
<style>{`
  @keyframes expandWidth {
    from {
      width: 0;
    }
    to {
      width: 80px;
    }
  }

  .animate-expandWidth {
    animation: expandWidth 1s ease-out forwards;
  }
`}</style>
