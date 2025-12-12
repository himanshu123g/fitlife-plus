import React, { useEffect, useRef, useState } from 'react';
import API from '../api';

export default function SuccessStories() {
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await API.get('/reviews?limit=4');
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-white relative overflow-hidden">


      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 overflow-hidden">
          <div 
            className={`inline-block px-5 py-2 bg-emerald-600 text-white text-sm font-semibold mb-6 shadow-sm transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
          >
            Real Results, Real People
          </div>
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Success Stories That Inspire
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-emerald-600 transition-all duration-1000 delay-500 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Join thousands who transformed their lives with FitLife+
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading success stories...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to share your success story!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {reviews.map((review, index) => (
              <div
                key={review._id}
                className={`bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* User Avatar Silhouette */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{review.userName}</h3>
                    <p className="text-sm text-gray-600">Age {review.userAge}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Membership Badge */}
                <div className={`px-3 py-2 mb-4 border ${
                  review.membershipPlan === 'elite' 
                    ? 'bg-purple-50 border-purple-200' 
                    : review.membershipPlan === 'pro'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm font-semibold text-center ${
                    review.membershipPlan === 'elite' 
                      ? 'text-purple-700' 
                      : review.membershipPlan === 'pro'
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}>
                    {review.membershipPlan.toUpperCase()} Member
                  </p>
                </div>

                {/* Likes */}
                <div className="flex items-center justify-center gap-2 mb-4 text-gray-600">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{review.likes} likes</span>
                </div>

                {/* Testimonial */}
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stats */}
        <div 
          className={`mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto transform transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">4.8/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Goal Achievement</div>
          </div>
        </div>
      </div>
    </section>
  );
}
