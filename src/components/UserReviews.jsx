import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchReviews();
    loadUser();
  }, []);

  const loadUser = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews/top');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to like reviews');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, likes: data.likes }
            : review
        ));
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displayedReviews.map((review, index) => (
          <ReviewCard 
            key={review._id} 
            review={review} 
            onLike={handleLike}
            isLoggedIn={!!user}
          />
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Show All Reviews ({reviews.length})</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Write Review CTA */}
      {user && (
        <div className="mt-8 text-center">
          <Link
            to="/write-review"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write Your Review
          </Link>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, onLike, isLoggedIn }) {
  const getMembershipColor = (plan) => {
    switch (plan) {
      case 'elite': return 'text-purple-700 bg-purple-100';
      case 'pro': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getMembershipLabel = (plan) => {
    switch (plan) {
      case 'elite': return 'Elite Member';
      case 'pro': return 'Pro Member';
      default: return 'Free Member';
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative">
      {/* Quote Icon */}
      <div className="mb-4">
        <svg className="w-8 h-8 text-blue-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 italic mb-4 leading-relaxed">"{review.comment}"</p>

      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {review.userName}{review.userAge ? `, ${review.userAge}` : ''}
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${getMembershipColor(review.membershipPlan)}`}>
              {getMembershipLabel(review.membershipPlan)}
            </div>
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={() => onLike(review._id)}
          disabled={!isLoggedIn}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${
            isLoggedIn 
              ? 'hover:bg-red-50 text-gray-600 hover:text-red-600' 
              : 'opacity-50 cursor-not-allowed text-gray-400'
          }`}
          title={isLoggedIn ? 'Like this review' : 'Login to like'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm font-medium">{review.likes || 0}</span>
        </button>
      </div>
    </div>
  );
}
