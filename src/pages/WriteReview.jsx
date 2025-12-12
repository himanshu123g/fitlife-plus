import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function WriteReview() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingReview();
  }, []);

  const checkExistingReview = async () => {
    try {
      setCheckingReview(true);
      const response = await API.get('/reviews/my-review');
      
      if (response.data) {
        setExistingReview(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment);
        setIsEditing(true);
      }
    } catch (err) {
      // 404 means no review exists, which is fine
      if (err.response?.status !== 404) {
        console.error('Error checking existing review:', err);
      }
    } finally {
      setCheckingReview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing && existingReview) {
        // Update existing review
        await API.put(`/reviews/${existingReview._id}`, { rating, comment });
        alert('Review updated successfully! It will be visible after admin approval.');
      } else {
        // Create new review
        await API.post('/reviews', { rating, comment });
        alert('Review submitted successfully! It will be visible after admin approval.');
      }
      navigate('/features');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    try {
      setLoading(true);
      await API.delete(`/reviews/${existingReview._id}`);
      alert('Review deleted successfully!');
      navigate('/features');
    } catch (err) {
      setError('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  if (checkingReview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Your Review' : 'Write a Review'}
            </h1>
            {isEditing && existingReview && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                existingReview.isApproved 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {existingReview.isApproved ? '✓ Approved' : '⏳ Pending'}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-8">
            {isEditing ? 'Update your experience with FitLife+' : 'Share your experience with FitLife+'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-3 text-gray-600 font-medium">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your experience with FitLife+. What features do you love? How has it helped you?"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
              </button>
              {isEditing && existingReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/features')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Review Guidelines</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Your review will be visible after admin approval</li>
                  <li>Be honest and constructive in your feedback</li>
                  <li>You can only submit one review per account</li>
                  {isEditing && <li>Editing your review will require re-approval</li>}
                  <li>Reviews with the most likes appear at the top</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
