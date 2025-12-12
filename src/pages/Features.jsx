import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserReviews from '../components/UserReviews';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});
  const navigate = useNavigate();
  
  // Get user membership status
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const membershipPlan = user?.membership?.plan || 'free';
  const isPremium = membershipPlan === 'pro' || membershipPlan === 'elite';
  const isElite = membershipPlan === 'elite';

  const handleChatNowClick = (e) => {
    e.preventDefault();
    localStorage.setItem('openFitBot', 'true');
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-16 pb-12">
        <div className={`text-center max-w-4xl mx-auto transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
            Complete Fitness Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Transform Your Health
            </span>
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-1000 ease-out animate-expandWidth"></div>
          </div>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Personalized workout plans, expert coaching, premium supplements, and AI-powered guidance — all in one place
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link 
              to="/membership" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View Membership Plans
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-200 hover:border-blue-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Try Free Features
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Fitness Goal
            </h2>
            <p className="text-lg text-gray-600">
              From beginners to elite athletes — we have got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* FREE FEATURES */}
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              title="BMI Calculator & Tracker"
              text="Calculate your BMI instantly with visual charts and get personalized health insights based on your measurements."
              tag="Free"
              tagColor="bg-emerald-100 text-emerald-700"
              borderColor="border-t-emerald-500"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              delay="0"
              isVisible={isVisible}
              action={<Link to="/dashboard" className="btn-feature">Try Now</Link>}
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
              title="Natural Home Remedies"
              text="Discover 15+ proven natural remedies for common health issues like cold, headache, digestion problems, and seasonal ailments."
              tag="Free"
              tagColor="bg-teal-100 text-teal-700"
              borderColor="border-t-teal-500"
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
              delay="100"
              isVisible={isVisible}
              action={<Link to="/remedies" className="btn-feature">View Remedies</Link>}
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              title="Supplement Shop"
              text="Browse premium supplements from trusted brands. Pro members get 4% off, Elite members get 10% off!"
              tag="Free Browsing"
              tagColor="bg-orange-100 text-orange-700"
              borderColor="border-t-orange-500"
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              delay="200"
              isVisible={isVisible}
              action={<Link to="/shop" className="btn-feature">Browse Shop</Link>}
            />

            {/* PRO FEATURES */}
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="7-Day Exercise & Diet Plans"
              text="Complete weekly workout routines and meal plans with calorie tracking. Pro members get standard plans, Elite members get advanced training programs."
              tag="Pro & Elite"
              tagColor="bg-blue-100 text-blue-700"
              borderColor="border-t-blue-500"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              ribbon="Pro"
              ribbonColor="bg-blue-600"
              lock={!isPremium}
              delay="300"
              isVisible={isVisible}
              action={
                isPremium ? (
                  <Link to="/exercise-diet-plans" className="btn-feature">View Plans</Link>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Pro</Link>
                )
              }
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
              title="AI FitBot Assistant"
              text="Get instant answers to fitness, diet, and lifestyle questions 24/7. Available for both Pro and Elite members with unlimited conversations."
              tag="Pro & Elite"
              tagColor="bg-indigo-100 text-indigo-700"
              borderColor="border-t-indigo-500"
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
              ribbon="Pro"
              ribbonColor="bg-blue-600"
              lock={!isPremium}
              delay="400"
              isVisible={isVisible}
              action={
                isPremium ? (
                  <button onClick={handleChatNowClick} className="btn-feature flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat Now
                  </button>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Pro</Link>
                )
              }
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
              title="Exclusive Supplement Discounts"
              text="Save on every purchase! Pro members (₹199/month) get 4% off, Elite members (₹499/month) get 10% off on all supplements."
              tag="Pro & Elite"
              tagColor="bg-amber-100 text-amber-700"
              borderColor="border-t-amber-500"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              ribbon="Pro"
              ribbonColor="bg-blue-600"
              lock={!isPremium}
              delay="500"
              isVisible={isVisible}
              action={
                isPremium ? (
                  <Link to="/shop" className="btn-feature">Shop Now</Link>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Pro</Link>
                )
              }
            />

            {/* ELITE FEATURES */}
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              title="1-on-1 Video Coaching"
              text="Exclusive for Elite members (₹499/month). Book live HD video sessions with certified trainers for personalized coaching and form correction."
              tag="Elite Only"
              tagColor="bg-purple-100 text-purple-700"
              borderColor="border-t-purple-500"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              ribbon="Elite"
              ribbonColor="bg-purple-600"
              lock={!isElite}
              delay="600"
              isVisible={isVisible}
              action={
                isElite ? (
                  <Link to="/video-call" className="btn-feature">Book Session</Link>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Elite</Link>
                )
              }
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Advanced Workout Plans"
              text="Pro and Elite members get access to professional-grade training programs. Pro members (₹199/month) get standard plans, Elite members (₹499/month) get advanced HIIT routines and athlete-level techniques."
              tag="Pro & Elite"
              tagColor="bg-blue-100 text-blue-700"
              borderColor="border-t-blue-500"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              ribbon="Pro"
              ribbonColor="bg-blue-600"
              lock={!isPremium}
              delay="700"
              isVisible={isVisible}
              action={
                isPremium ? (
                  <Link to="/exercise-diet-plans" className="btn-feature">View Plans</Link>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Pro</Link>
                )
              }
            />

            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Expert Supplement Guidance"
              text="Elite members (₹499/month) get detailed descriptions, usage instructions, and personalized recommendations for every supplement in our shop."
              tag="Elite Only"
              tagColor="bg-pink-100 text-pink-700"
              borderColor="border-t-pink-500"
              iconBg="bg-pink-100"
              iconColor="text-pink-600"
              ribbon="Elite"
              ribbonColor="bg-purple-600"
              lock={!isElite}
              delay="800"
              isVisible={isVisible}
              action={
                isElite ? (
                  <Link to="/shop" className="btn-feature">Browse Supplements</Link>
                ) : (
                  <Link to="/membership" className="btn-feature">Unlock Elite</Link>
                )
              }
            />
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-white border-2 border-gray-200 rounded-2xl p-12 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Get Started with FitLife+
            </h3>
            <p className="text-xl mb-8 text-gray-600">
              Everything you need for a healthier lifestyle, all in one place
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link 
                to="/membership" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View Membership Plans
              </Link>
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Try Free Features
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose FitLife+ Section */}
      <section 
        ref={(el) => (sectionRefs.current.whyChoose = el)}
        data-section="whyChoose"
        className="container mx-auto px-4 py-16 bg-white"
      >
        <div className={`max-w-6xl mx-auto transform transition-all duration-700 ${visibleSections.whyChoose ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose FitLife+?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WhyCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              title="Personalized Health Insights"
              description="Smart recommendations based on BMI and age."
            />
            <WhyCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              title="Easy Integration"
              description="Seamless user experience across all devices."
            />
            <WhyCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="24/7 Availability"
              description="Get access to features anytime, anywhere."
            />
            <WhyCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              title="Expert-Curated Plans"
              description="Guidance designed by certified trainers and dietitians."
            />
          </div>
        </div>
      </section>

      {/* How FitLife+ Works Section */}
      <section 
        ref={(el) => (sectionRefs.current.howItWorks = el)}
        data-section="howItWorks"
        className="container mx-auto px-4 py-16 bg-gray-50"
      >
        <div className={`max-w-5xl mx-auto transform transition-all duration-700 ${visibleSections.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How FitLife+ Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 z-0"></div>
            
            <StepCard
              number="1"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              title="Calculate your BMI"
              description="Start by understanding your current health status with our instant BMI calculator."
            />
            
            <StepCard
              number="2"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
              title="Get your Personalized Plan"
              description="Receive customized diet and exercise recommendations tailored to your goals."
            />
            
            <StepCard
              number="3"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              title="Track Progress & Stay Consistent"
              description="Monitor your journey and stay motivated with our tracking tools and FitBot support."
            />
          </div>
        </div>
      </section>


      {/* Real-Time User Reviews Section */}
      <section 
        ref={(el) => (sectionRefs.current.testimonials = el)}
        data-section="testimonials"
        className="container mx-auto px-4 py-16 bg-gray-50"
      >
        <div className={`max-w-6xl mx-auto transform transition-all duration-700 ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg text-gray-600">
              Real reviews from real people achieving real results
            </p>
          </div>
          <UserReviews />
        </div>
      </section>

      {/* Floating Help Button */}
      <Link
        to="/dashboard"
        className="fixed bottom-6 right-6 z-50 group"
        title="Chat with FitBot"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
              Chat with FitBot
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
        </div>
      </Link>

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
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, text, tag, tagColor, borderColor, iconBg, iconColor, ribbon, ribbonColor, lock, delay, isVisible, action }) {
  return (
    <div 
      className={`relative transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {ribbon && (
        <div className={`absolute -top-3 -right-3 z-10 px-4 py-1 rounded-full ${ribbonColor || 'bg-slate-900'} text-white shadow-md font-medium text-xs`}>
          {ribbon}
        </div>
      )}
      <div className={`rounded-xl bg-white border-t-4 ${borderColor} border-x border-b border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full`}>
        <div className="p-6">
          <div className={`w-14 h-14 rounded-lg ${iconBg || 'bg-slate-50'} ${iconColor || 'text-slate-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">{text}</p>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
              {tag}
            </span>
            {lock && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Locked
              </span>
            )}
          </div>
          <div>{action}</div>
        </div>
      </div>
    </div>
  );
}

// Why Choose Card Component
function WhyCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300 hover:shadow-lg group">
      <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}


// Step Card Component
function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative z-10 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
          {number}
        </div>
        <div className="text-blue-600 mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, name, age, plan }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        <svg className="w-8 h-8 text-blue-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 italic mb-4 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}, {age}</div>
          <div className="text-sm text-gray-600">{plan}</div>
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
