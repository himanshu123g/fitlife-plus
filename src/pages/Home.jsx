import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FitLife+
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Smart Fitness Companion
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🎉 Deployment Successful!</h2>
            <p className="text-gray-700 mb-4">
              Your FitLife+ application is now live on the web. This is a simplified version to test the deployment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold text-blue-900">✅ Frontend</h3>
                <p className="text-blue-700">Successfully deployed on Vercel</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-semibold text-yellow-900">⏳ Backend</h3>
                <p className="text-yellow-700">Coming soon on separate service</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Test Button - Working!
              </button>
              <p className="text-sm text-gray-500">
                Full features will be available once backend is deployed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
