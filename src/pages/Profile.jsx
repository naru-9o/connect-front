import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Camera, Save, User as UserIcon, Building, MapPin, DollarSign, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { industries, fundingStages, locations } from '../services/mockData';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  startupName: yup.string().required('Startup name is required'),
  industry: yup.string().required('Industry is required'),
  fundingStage: yup.string().required('Funding stage is required'),
  location: yup.string().required('Location is required'),
  bio: yup.string().min(50, 'Bio must be at least 50 characters').required('Bio is required')
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      startupName: user?.startupName || '',
      industry: user?.industry || '',
      fundingStage: user?.fundingStage || '',
      location: user?.location || '',
      bio: user?.bio || ''
    }
  });

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('startupName', data.startupName);
    formData.append('industry', data.industry);
    formData.append('fundingStage', data.fundingStage);
    formData.append('location', data.location);
    formData.append('bio', data.bio);
    
    if (imageFile) {
      formData.append('profileImage', imageFile);
    } else {
      console.warn('⚠️ No image selected. Only text fields will be submitted.');
    }
    await updateProfile(formData); // Pass formData here!
    
    setIsEditing(false);
    setImageFile(null); // Reset image
    toast.success('Profile updated successfully!');
    
    if (Notification.permission === 'granted') {
      new Notification('Profile updated successfully!');
    }
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    toast.error('Failed to update profile. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
             {isEditing && (
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-60 transition-opacity cursor-pointer">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
              )}

            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-blue-100 text-lg">{user.startupName}</p>
              <p className="text-blue-200 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={handleCancel}
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty && !imageFile || isLoading}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <UserIcon size={16} className="mr-2" />
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Building size={16} className="mr-2" />
                    Startup Name
                  </label>
                  <input
                    {...register('startupName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.startupName && (
                    <p className="mt-1 text-sm text-red-600">{errors.startupName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    {...register('industry')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    Funding Stage
                  </label>
                  <select
                    {...register('fundingStage')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fundingStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  {errors.fundingStage && (
                    <p className="mt-1 text-sm text-red-600">{errors.fundingStage.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Location
                  </label>
                  <select
                    {...register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself and your startup..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Building size={16} className="mr-2" />
                    INDUSTRY
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">{user.industry}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    FUNDING STAGE
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">{user.fundingStage}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    LOCATION
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">{user.location}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <FileText size={20} className="mr-2" />
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;