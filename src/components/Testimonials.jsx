import React, { useEffect, useRef, useState } from 'react';

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
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

  const testimonials = [
    {
      name: 'Aman Kumar',
      age: 27,
      role: 'Software Engineer',
      review: 'FitLife+ transformed my lifestyle! The BMI calculator and diet plans helped me lose 15kg in 6 months.',
      rating: 5,
      initials: 'AK'
    },
    {
      name: 'Priya Sharma',
      age: 24,
      role: 'Fitness Enthusiast',
      review: 'The FitBot assistant is amazing! It gives me instant workout advice and keeps me motivated every day.',
      rating: 5,
      initials: 'PS'
    },
    {
      name: 'Rahul Verma',
      age: 32,
      role: 'Business Owner',
      review: 'As a busy professional, FitLife+ helps me stay on track with my health goals. The home remedies section is a lifesaver!',
      rating: 5,
      initials: 'RV'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div 
          className={`text-center max-w-3xl mx-auto mb-12 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of users achieving their fitness goals with FitLife+
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-300 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-5 h-5 text-amber-400 transform hover:scale-125 transition-transform duration-200" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Review */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.review}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}, {testimonial.age}
                  </div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
