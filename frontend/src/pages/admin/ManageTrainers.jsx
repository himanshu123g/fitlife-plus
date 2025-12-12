import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api';

export default function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newTrainerCredentials, setNewTrainerCredentials] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: ''
  });
  const [resetPassword, setResetPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPasswordField, setShowResetPasswordField] = useState(false);

  useEffect(() => {
    loadData();
    
    // Poll for updates every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [trainersRes, requestsRes] = await Promise.all([
        API.get('/trainers/admin/all'),
        API.get('/trainers/admin/password-requests')
      ]);
      
      setTrainers(trainersRes.data.trainers || []);
      setPasswordRequests(requestsRes.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error('Load data error:', err);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (trainer) => {
    setSelectedTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      password: '',
      specialization: trainer.specialization
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowResetPasswordModal(false);
    setSelectedTrainer(null);
    setResetPassword('');
  };

  const openResetPasswordModal = (trainer) => {
    setSelectedTrainer(trainer);
    setResetPassword('');
    setShowResetPasswordModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    try {
      await API.post('/trainers/admin/add', formData);
      
      // Store credentials to show in modal
      setNewTrainerCredentials({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization
      });
      
      closeModals();
      setShowCredentialsModal(true);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add trainer');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    try {
      await API.put(`/trainers/admin/${selectedTrainer._id}`, formData);
      alert('Trainer updated successfully!');
      closeModals();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update trainer');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (resetPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    try {
      await API.put(`/trainers/admin/reset-password/${selectedTrainer._id}`, {
        newPassword: resetPassword
      });
      alert('Password reset successfully!');
      closeModals();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const approvePasswordChange = async (trainerId) => {
    if (!window.confirm('Approve this password change request?')) return;
    
    try {
      await API.put(`/trainers/admin/approve-password/${trainerId}`);
      alert('Password change approved!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve password change');
    }
  };

  const rejectPasswordChange = async (trainerId) => {
    if (!window.confirm('Reject this password change request?')) return;
    
    try {
      await API.put(`/trainers/admin/reject-password/${trainerId}`);
      alert('Password change request rejected');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject password change');
    }
  };

  const handleDelete = async (trainerId) => {
    if (!window.confirm('Are you sure you want to remove this trainer? They will lose access immediately.')) return;
    
    try {
      await API.delete(`/trainers/admin/${trainerId}`);
      alert('Trainer removed successfully');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove trainer');
    }
  };

  const toggleActive = async (trainer) => {
    try {
      await API.put(`/trainers/admin/${trainer._id}`, {
        isActive: !trainer.isActive
      });
      loadData();
    } catch (err) {
      alert('Failed to update trainer status');
    }
  };

  const getStatusBadge = (trainer) => {
    if (!trainer.isActive) {
      return 'bg-red-100 text-red-700';
    }
    if (trainer.status === 'blocked') {
      return 'bg-orange-100 text-orange-700';
    }
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (trainer) => {
    if (!trainer.isActive) return 'Removed';
    if (trainer.status === 'blocked') return 'Blocked';
    return 'Active';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Trainer
          </button>
        </div>

        {/* Password Change Requests */}
        {passwordRequests.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password Change Requests ({passwordRequests.length})
            </h2>
            <div className="space-y-3">
              {passwordRequests.map((trainer) => (
                <div key={trainer._id} className="bg-white rounded-lg p-4 flex items-center justify-between border border-yellow-300">
                  <div>
                    <p className="font-semibold text-gray-900">{trainer.name}</p>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(trainer.passwordChangeRequest?.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approvePasswordChange(trainer._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectPasswordChange(trainer._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trainers List */}
        {trainers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 mb-4">No trainers added yet</p>
            <button
              onClick={openAddModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Add Your First Trainer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">{trainer.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{trainer.name}</h3>
                      <p className="text-sm text-gray-600">{trainer.specialization || 'No specialization'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(trainer)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(trainer)}`}
                  >
                    {getStatusText(trainer)}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {trainer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Joined {new Date(trainer.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(trainer)}
                      className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openResetPasswordModal(trainer)}
                      className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-all"
                    >
                      Reset Password
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(trainer._id)}
                    className="w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-all"
                  >
                    Remove Trainer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Trainer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeModals}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Trainer</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  placeholder="e.g., Strength Training, Yoga, Cardio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Add Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainer Modal */}
      {showEditModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeModals}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Trainer</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {selectedTrainer?.plainPassword && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Current Password</label>
                  <p className="font-mono font-bold text-blue-700 text-lg">{selectedTrainer.plainPassword}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Update Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeModals}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reset Trainer Password</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Trainer:</span> {selectedTrainer.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Email:</span> {selectedTrainer.email}
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showResetPasswordField ? "text" : "password"}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordField(!showResetPasswordField)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showResetPasswordField ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">This will immediately update the trainer's password</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Display Modal - Balanced Professional Design */}
      {showCredentialsModal && newTrainerCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Header with subtle brand color */}
            <div className="bg-slate-800 px-6 py-5 border-b-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Trainer Account Created</h3>
                  <p className="text-slate-300 text-sm">Save these login credentials</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Credentials - Clean with subtle colors */}
              <div className="space-y-3 mb-5">
                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Name</label>
                  <p className="text-base font-semibold text-slate-900">{newTrainerCredentials.name}</p>
                </div>
                
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">Email (Login ID)</label>
                  <p className="text-base font-semibold text-blue-900">{newTrainerCredentials.email}</p>
                </div>
                
                <div className="bg-slate-100 px-4 py-3 rounded-lg border-2 border-slate-300">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">Password</label>
                  <p className="text-lg font-mono font-bold text-slate-900">{newTrainerCredentials.password}</p>
                </div>
                
                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Specialization</label>
                  <p className="text-base font-semibold text-slate-900">{newTrainerCredentials.specialization}</p>
                </div>
              </div>

              {/* Warning - Subtle */}
              <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3 mb-5 rounded-r">
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">Important:</span> Password cannot be retrieved later. Copy it now.
                </p>
              </div>

              {/* Buttons - Professional */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const text = `Trainer Credentials\n\nName: ${newTrainerCredentials.name}\nEmail: ${newTrainerCredentials.email}\nPassword: ${newTrainerCredentials.password}\nSpecialization: ${newTrainerCredentials.specialization}\n\nLogin URL: ${window.location.origin}/trainer/login`;
                    navigator.clipboard.writeText(text);
                    alert('Credentials copied to clipboard!');
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Credentials
                </button>
                <button
                  onClick={() => {
                    setShowCredentialsModal(false);
                    setNewTrainerCredentials(null);
                  }}
                  className="px-6 py-3 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}