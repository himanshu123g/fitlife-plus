import React, { useState, useMemo, useEffect, useRef } from 'react';
import { remediesData, categories, getRemedyIcon, mostCommonRemedies, quickFilters } from '../data/remediesData';
import { newRemedies } from '../data/newRemedies';

export default function RemediesEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bookmarkedRemedies, setBookmarkedRemedies] = useState([]);
  const [viewedRemedies, setViewedRemedies] = useState([]);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});
  
  // Combine all remedies
  const allRemedies = useMemo(() => [...remediesData, ...newRemedies], []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('remedyBookmarks');
    if (saved) {
      setBookmarkedRemedies(JSON.parse(saved));
    }
    // Load viewed remedies
    const viewed = localStorage.getItem('remedyViewed');
    if (viewed) {
      setViewedRemedies(JSON.parse(viewed));
    }
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (remedyId) => {
    const updated = bookmarkedRemedies.includes(remedyId)
      ? bookmarkedRemedies.filter(id => id !== remedyId)
      : [...bookmarkedRemedies, remedyId];
    setBookmarkedRemedies(updated);
    localStorage.setItem('remedyBookmarks', JSON.stringify(updated));
  };

  // Track viewed remedies
  const trackView = (remedyId) => {
    if (!viewedRemedies.includes(remedyId)) {
      const updated = [...viewedRemedies, remedyId].slice(-10); // Keep last 10
      setViewedRemedies(updated);
      localStorage.setItem('remedyViewed', JSON.stringify(updated));
    }
  };

  // Filter remedies
  const filteredRemedies = useMemo(() => {
    let filtered = allRemedies;

    // Quick filter
    if (activeQuickFilter) {
      const filter = quickFilters.find(f => f.id === activeQuickFilter);
      if (filter.remedyIds) {
        filtered = filtered.filter(r => filter.remedyIds.includes(r.id));
      } else if (filter.category) {
        filtered = filtered.filter(r => r.category === filter.category);
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && !activeQuickFilter) {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      filtered = filtered.filter(remedy => remedy.category === categoryName);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(remedy =>
        remedy.title.toLowerCase().includes(query) ||
        remedy.shortDescription.toLowerCase().includes(query) ||
        remedy.symptoms.some(s => s.toLowerCase().includes(query)) ||
        remedy.treatments.some(t => t.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, activeQuickFilter, allRemedies]);

  // Get most common remedies
  const commonRemedies = useMemo(() => {
    return allRemedies.filter(r => mostCommonRemedies.includes(r.id));
  }, [allRemedies]);

  // Intersection Observer for scroll animations (same as Shop page)
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
  }, [filteredRemedies]);

  // Get bookmarked remedies
  const bookmarked = useMemo(() => {
    return allRemedies.filter(r => bookmarkedRemedies.includes(r.id));
  }, [bookmarkedRemedies, allRemedies]);

  // Get recommended remedies (based on viewed)
  const recommended = useMemo(() => {
    if (viewedRemedies.length === 0) return [];
    const viewedCategories = allRemedies
      .filter(r => viewedRemedies.includes(r.id))
      .map(r => r.category);
    return allRemedies
      .filter(r => viewedCategories.includes(r.category) && !viewedRemedies.includes(r.id))
      .slice(0, 5);
  }, [viewedRemedies, allRemedies]);

  const openRemedyModal = (remedy) => {
    setSelectedRemedy(remedy);
    setIsModalOpen(true);
    trackView(remedy.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRemedy(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 overflow-hidden">
          <h1 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Natural Home Remedies
          </h1>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-emerald-600 transition-all duration-[1500ms] ease-out delay-300 ${isVisible ? 'w-48' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-gray-600 max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Trusted household remedies for common health issues. Simple, natural, and effective solutions passed down through generations.
          </p>
        </div>

        {/* Search Bar */}
        <div className={`max-w-2xl mx-auto mb-6 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search remedies, symptoms, or treatments..."
              className="w-full px-5 py-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className={`flex flex-wrap justify-center gap-2 mb-6 transform transition-all duration-700 delay-250 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveQuickFilter(activeQuickFilter === filter.id ? null : filter.id);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeQuickFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Bookmarked Remedies */}
        {bookmarked.length > 0 && (
          <div className={`mb-8 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Bookmarked Remedies
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {bookmarked.map((remedy) => (
                <div
                  key={remedy.id}
                  onClick={() => openRemedyModal(remedy)}
                  className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {getRemedyIcon(remedy.icon)}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{remedy.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{remedy.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Common Remedies */}
        <div className={`mb-8 transform transition-all duration-700 delay-350 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Common Remedies</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {commonRemedies.map((remedy) => (
              <div
                key={remedy.id}
                onClick={() => openRemedyModal(remedy)}
                className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 cursor-pointer hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    {getRemedyIcon(remedy.icon)}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{remedy.title}</h3>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">{remedy.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        {recommended.length > 0 && (
          <div className={`mb-8 transform transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Recommended For You
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recommended.map((remedy) => (
                <div
                  key={remedy.id}
                  onClick={() => openRemedyModal(remedy)}
                  className="flex-shrink-0 w-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 cursor-pointer hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                      {getRemedyIcon(remedy.icon)}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{remedy.title}</h3>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2">{remedy.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className={`flex flex-wrap justify-center gap-3 mb-10 transform transition-all duration-700 delay-450 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setActiveQuickFilter(null);
              }}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.id && !activeQuickFilter
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {category.name}
              <span className={`ml-2 text-sm ${selectedCategory === category.id && !activeQuickFilter ? 'text-blue-100' : 'text-gray-500'}`}>
                ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        {(searchQuery || activeQuickFilter) && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredRemedies.length}</span> {filteredRemedies.length === 1 ? 'remedy' : 'remedies'}
            </p>
          </div>
        )}

        {/* Remedies Grid */}
        {filteredRemedies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-6 pb-4">
            {filteredRemedies.map((remedy, index) => (
              <div
                key={remedy.id}
                ref={(el) => (cardRefs.current[remedy.id] = el)}
                data-card-id={remedy.id}
                className={`relative bg-white rounded-xl border border-gray-200 p-6 pt-8 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 hover:z-20 cursor-pointer transition-all duration-300 ${
                  visibleCards.has(remedy.id) ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-8'
                }`}
                onClick={() => openRemedyModal(remedy)}
              >
                {/* Bookmark Button */}
                <div className="flex justify-between items-start mb-4 -mt-2">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {getRemedyIcon(remedy.icon)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(remedy.id);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill={bookmarkedRemedies.includes(remedy.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{remedy.title}</h3>

                {/* Category Badge */}
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                  {remedy.category}
                </span>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{remedy.shortDescription}</p>

                {/* View Details Button */}
                <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No remedies found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h4>
              <p className="text-sm text-amber-800">
                These remedies are for informational purposes only and should not replace professional medical advice. 
                Always consult with a healthcare provider for serious or persistent symptoms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Remedy Detail Modal - Will continue in next part */}

      {/* Remedy Detail Modal */}
      {isModalOpen && selectedRemedy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white border-b-2 border-gray-200 px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  {getRemedyIcon(selectedRemedy.icon)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRemedy.title}</h2>
                  <span className="text-sm text-gray-600 font-medium">{selectedRemedy.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(selectedRemedy.id);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill={bookmarkedRemedies.includes(selectedRemedy.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-gray-50">
              {/* Symptoms */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Symptoms
                </h3>
                <ul className="space-y-2.5">
                  {selectedRemedy.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 pl-2">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-orange-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Common Causes
                </h3>
                <ul className="space-y-2.5">
                  {selectedRemedy.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 pl-2">
                      <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Home Treatments */}
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Home Treatments
                </h3>
                <ul className="space-y-2.5">
                  {selectedRemedy.treatments.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-800 pl-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed font-medium">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Foods & Drinks */}
              {selectedRemedy.recommendedFoods && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Recommended Foods & Drinks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRemedy.recommendedFoods.map((food, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-lg text-sm font-medium">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Avoid */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  What to Avoid
                </h3>
                <ul className="space-y-2">
                  {selectedRemedy.avoid.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              {selectedRemedy.preventionTips && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Prevention Tips
                  </h3>
                  <ul className="space-y-2">
                    {selectedRemedy.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to Consult Doctor */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  When to Consult a Doctor
                </h3>
                <p className="text-gray-700">{selectedRemedy.whenToConsult}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
