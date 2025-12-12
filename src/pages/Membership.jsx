import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Membership() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const [loading, setLoading] = useState({ plan: null, message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const currentPlan = user?.membership?.plan || 'free';
  const isFreePlan = !currentPlan || currentPlan === 'free';
  const isProPlan = currentPlan === 'pro';
  const isElitePlan = currentPlan === 'elite';

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleUpgrade = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setLoading({ plan, message: 'Initiating payment...' });
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await API.post('/membership/create-order', { plan }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { order, key } = orderResponse.data;

      // Step 2: Open Razorpay payment modal
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'FitLife+',
        description: `${plan.toUpperCase()} Membership Plan`,
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            setLoading({ plan, message: 'Verifying payment...' });
            const verifyResponse = await API.post('/membership/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              notes: order.notes
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyResponse.data.membership) {
              const updatedUser = { ...user, membership: verifyResponse.data.membership };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
              setSuccessMessage(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
              setTimeout(() => window.location.reload(), 2000);
            }
          } catch (error) {
            setErrorMessage('Payment verification failed. Please contact support.');
            setLoading({ plan: null, message: '' });
          }
        },
        prefill: {
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setLoading({ plan: null, message: '' });
            setErrorMessage('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to initiate payment');
      setLoading({ plan: null, message: '' });
    }
  };

  const handleDowngrade = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Are you sure you want to downgrade to Free plan?')) return;

    setLoading({ plan: 'free', message: 'Processing...' });
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await API.post('/membership/downgrade', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const updatedUser = { ...user, membership: { plan: 'free' } };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccessMessage('Successfully downgraded to Free plan');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to downgrade membership');
    } finally {
      setLoading({ plan: null, message: '' });
    }
  };

  // Feature list with availability per plan
  const features = [
    { name: 'BMI Calculator & Tracker', free: true, pro: true, elite: true },
    { name: 'Natural Home Remedies (15+)', free: true, pro: true, elite: true },
    { name: 'Supplement Shop Access', free: true, pro: true, elite: true },
    { name: 'Basic Health Tips', free: true, pro: true, elite: true },
    { name: '7-Day Exercise Plans', free: false, pro: true, elite: true },
    { name: '7-Day Diet Plans', free: false, pro: true, elite: true },
    { name: 'AI FitBot Assistant (24/7)', free: false, pro: true, elite: true },
    { name: 'Printable Meal Plans', free: false, pro: true, elite: true },
    { name: 'Supplement Discounts (4%)', free: false, pro: true, elite: false },
    { name: 'Supplement Discounts (10%)', free: false, pro: false, elite: true },
    { name: 'Expert Supplement Guidance', free: false, pro: false, elite: true },
    { name: 'Advanced Workout Programs', free: false, pro: false, elite: true },
    { name: '1-on-1 Video Coaching', free: false, pro: false, elite: true },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className={`text-center max-w-4xl mx-auto transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 bg-blue-600 rounded-full transition-all duration-1000 ease-out animate-expandWidth"></div>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Unlock premium features and accelerate your fitness journey
            </p>
            {currentPlan !== 'free' && (
              <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md border-2 border-gray-200">
                <span className="text-gray-600">Current Plan: </span>
                <span className={`font-bold ${isProPlan ? 'text-blue-600' : 'text-purple-600'}`}>
                  {currentPlan.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Messages */}
      {successMessage && (
        <div className="container mx-auto px-4 mt-6">
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="container mx-auto px-4 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            title="Free"
            price="₹0"
            period="forever"
            description="Perfect for getting started"
            features={[
              'BMI Calculator',
              'Home Remedies Library',
              'Supplement Information',
              'Basic Health Tips'
            ]}
            isActive={isFreePlan}
            isCurrent={isFreePlan}
            buttonText={isFreePlan ? 'Current Plan' : 'Downgrade'}
            buttonAction={isFreePlan ? null : handleDowngrade}
            buttonDisabled={isFreePlan}
            loading={loading.plan === 'free'}
            delay="0"
            isVisible={isVisible}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            price="₹199"
            period="per month"
            description="Most popular for fitness enthusiasts"
            features={[
              'Everything in Free',
              '7-Day Exercise & Diet Plans',
              'AI FitBot Assistant (24/7)',
              'Printable Meal Plans',
              '4% Supplement Discounts'
            ]}
            isActive={isProPlan}
            isCurrent={isProPlan}
            isPopular={true}
            buttonText={isProPlan ? 'Current Plan' : isElitePlan ? 'Downgrade' : 'Upgrade to Pro'}
            buttonAction={isProPlan ? null : () => handleUpgrade('pro')}
            buttonDisabled={isProPlan}
            loading={loading.plan === 'pro'}
            delay="200"
            isVisible={isVisible}
            accentColor="blue"
          />

          {/* Elite Plan */}
          <PricingCard
            title="Elite"
            price="₹499"
            period="per month"
            description="For serious athletes and professionals"
            features={[
              'Everything in Pro',
              '10% Supplement Discounts (vs 4%)',
              'Expert Supplement Guidance',
              'Advanced Workout Programs',
              '1-on-1 Video Coaching with Trainers'
            ]}
            isActive={isElitePlan}
            isCurrent={isElitePlan}
            isPremium={true}
            buttonText={isElitePlan ? 'Current Plan' : 'Upgrade to Elite'}
            buttonAction={isElitePlan ? null : () => handleUpgrade('elite')}
            buttonDisabled={isElitePlan}
            loading={loading.plan === 'elite'}
            delay="400"
            isVisible={isVisible}
            accentColor="purple"
          />
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Compare All Features
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700 bg-blue-50">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-700 bg-purple-50">Elite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {features.map((feature, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {feature.free ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-blue-50/30">
                        {feature.pro ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-purple-50/30">
                        {feature.elite ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Upgrade Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Upgrade?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Faster Results"
              description="Personalized plans help you achieve your fitness goals 3x faster than generic approaches"
              color="blue"
            />
            <BenefitCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Save Money"
              description="Get discounts on supplements and avoid expensive gym memberships with home workouts"
              color="green"
            />
            <BenefitCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Expert Guidance"
              description="Access certified trainers and nutritionists through video calls and AI assistance"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I cancel my membership anytime?"
              answer="Yes! You can downgrade or cancel your membership at any time. Your access will continue until the end of your billing period."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway."
            />
            <FAQItem
              question="Is there a free trial for Pro or Elite?"
              answer="Currently, we offer a Free plan with basic features. You can upgrade to Pro or Elite anytime to access premium features."
            />
            <FAQItem
              question="Can I upgrade from Pro to Elite later?"
              answer="Absolutely! You can upgrade from Pro to Elite at any time. The price difference will be adjusted for the remaining period."
            />
            <FAQItem
              question="Do I get a refund if I downgrade?"
              answer="Downgrades take effect at the end of your current billing cycle. We don't offer partial refunds, but you'll retain access until the period ends."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Fitness Journey Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Choose the plan that fits your goals. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isProPlan && !isElitePlan && (
              <button
                onClick={() => handleUpgrade('pro')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                Start with Pro
              </button>
            )}
            {!isElitePlan && (
              <button
                onClick={() => handleUpgrade('elite')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                Go Elite
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ title, price, period, description, features, isActive, isCurrent, isPopular, isPremium, buttonText, buttonAction, buttonDisabled, loading, delay, isVisible, accentColor = 'gray' }) {
  const colors = {
    gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-700', button: 'bg-gray-600 hover:bg-gray-700' },
    blue: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
    purple: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' }
  };

  const color = colors[accentColor];

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg border-2 ${color.border} p-8 transform transition-all duration-700 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${isCurrent ? 'ring-4 ring-offset-2 ring-green-500' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      {isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
          Best Value
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-4 right-4 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
          Active
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">/ {period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={buttonAction}
        disabled={buttonDisabled || loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
          buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : color.button
        }`}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({ icon, title, description, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <div className={`w-16 h-16 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-600">
          {answer}
        </div>
      )}

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
