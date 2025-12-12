import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await API.get('/reviews/admin/all');
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      alert('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await API.put(`/reviews/admin/${reviewId}/approve`);
      alert('Review approved successfully!');
      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    }
  };



  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await API.delete(`/reviews/admin/${reviewId}`);
      alert('Review deleted successfully!');
      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.isApproved;
    if (filter === 'approved') return review.isApproved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.isApproved).length;
  const approvedCount = reviews.filter(r => r.isApproved).length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-end items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  review.isApproved ? 'border-green-500' : 'border-orange-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {review.userName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        Age: {review.userAge}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.membershipPlan === 'elite'
                          ? 'bg-purple-100 text-purple-700'
                          : review.membershipPlan === 'pro'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {review.membershipPlan.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.likes} likes
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Posted: {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`font-medium ${
                        review.isApproved ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {review.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
