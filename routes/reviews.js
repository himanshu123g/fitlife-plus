const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, skip = 0, featured = false } = req.query;
    
    const query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const reviews = await Review.find(query)
      .sort({ likes: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-likedBy');
    
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      total,
      hasMore: total > parseInt(skip) + reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top reviews (best 3-4)
router.get('/top', async (req, res) => {
  try {
    const topReviews = await Review.find({ isApproved: true })
      .sort({ likes: -1, createdAt: -1 })
      .limit(4)
      .select('-likedBy');
    
    res.json(topReviews);
  } catch (error) {
    console.error('Error fetching top reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own review (authenticated)
router.get('/my-review', auth, async (req, res) => {
  try {
    const review = await Review.findOne({ userId: req.user.id }).select('-likedBy');
    
    if (!review) {
      return res.status(404).json({ message: 'No review found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new review (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be 500 characters or less' });
    }
    
    // Check if user already posted a review
    const existingReview = await Review.findOne({ userId: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already posted a review. You can edit your existing review.' });
    }
    
    const user = await User.findById(req.user.id);
    
    const review = new Review({
      userId: req.user.id,
      userName: user.name,
      userAge: user.age,
      membershipPlan: user.membership?.plan || 'free',
      rating,
      comment,
      isApproved: false // Admin needs to approve
    });
    
    await review.save();
    
    res.status(201).json({
      message: 'Review submitted successfully! It will be visible after admin approval.',
      review
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's own review
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }
    
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.isApproved = false; // Needs re-approval after edit
    
    await review.save();
    
    res.json({
      message: 'Review updated successfully! It will be visible after admin approval.',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike a review
router.post('/:id/like', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const userIndex = review.likedBy.indexOf(req.user.id);
    
    if (userIndex > -1) {
      // Unlike
      review.likedBy.splice(userIndex, 1);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      // Like
      review.likedBy.push(req.user.id);
      review.likes += 1;
    }
    
    await review.save();
    
    res.json({
      likes: review.likes,
      isLiked: userIndex === -1
    });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user's own review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all reviews (pending and approved)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .select('-likedBy');
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve review
router.put('/admin/:id/approve', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.isApproved = true;
    await review.save();
    
    res.json({ message: 'Review approved', review });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Feature/Unfeature review
router.put('/admin/:id/feature', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.isFeatured = !review.isFeatured;
    await review.save();
    
    res.json({ 
      message: review.isFeatured ? 'Review featured' : 'Review unfeatured', 
      review 
    });
  } catch (error) {
    console.error('Error featuring review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete any review
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.deleteOne();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
