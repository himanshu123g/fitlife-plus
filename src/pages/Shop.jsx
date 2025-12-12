import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [loading] = useState(false);

  const mockProducts = [
    {
      _id: '1',
      name: 'Whey Protein Powder',
      brand: 'FitLife',
      category: 'Protein',
      price: 2999,
      imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Whey+Protein',
      description: 'High-quality whey protein for muscle building and recovery',
      stock: 50
    },
    {
      _id: '2',
      name: 'Creatine Monohydrate',
      brand: 'FitLife',
      category: 'Performance',
      price: 1499,
      imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Creatine',
      description: 'Pure creatine monohydrate for enhanced performance and strength',
      stock: 30
    },
    {
      _id: '3',
      name: 'BCAA Capsules',
      brand: 'FitLife',
      category: 'Recovery',
      price: 1999,
      imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=BCAA',
      description: 'Essential branched-chain amino acids for faster recovery',
      stock: 25
    },
    {
      _id: '4',
      name: 'Pre-Workout Energy',
      brand: 'FitLife',
      category: 'Energy',
      price: 1799,
      imageUrl: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Pre-Workout',
      description: 'High-energy pre-workout formula for intense training sessions',
      stock: 40
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Supplements Store
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 bg-blue-600 w-48"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Premium quality supplements from our trusted brand partners
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              {/* Product Image */}
              <div className="h-56 bg-gray-50 overflow-hidden rounded-t-2xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="p-5">
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
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                    Add to Cart
                  </button>
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">Demo Mode</h3>
          </div>
          <p className="text-blue-700 mb-4">
            This is a demonstration of the supplements store. Full functionality will be available once the backend is connected.
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            View Membership Plans
          </Link>
        </div>
      </div>
    </div>
  );
}