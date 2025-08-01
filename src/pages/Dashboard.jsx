import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ProfileCard from '../components/Common/ProfileCard';
import { industries, fundingStages, locations } from '../services/mockData';
import { usersAPI, messagesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFundingStage, setSelectedFundingStage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedIndustry) params.industry = selectedIndustry;
      if (selectedFundingStage) params.fundingStage = selectedFundingStage;
      if (selectedLocation) params.location = selectedLocation;
      
      const response = await usersAPI.getUsers(params);
      
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, searchTerm, selectedIndustry, selectedFundingStage, selectedLocation]);

  // NEW: Send starter message and navigate
  const handleMessageClick = async (userId) => {
    try {
      await messagesAPI.sendMessage({
        receiver: userId,
        content: "Hi! Let's connect."
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
    }

    navigate('/messages', { state: { selectedUserId: userId } });
  };

  const clearFilters = () => {
    setSelectedIndustry('');
    setSelectedFundingStage('');
    setSelectedLocation('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Founders</h1>
        <p className="mt-2 text-gray-600">
          Connect with fellow entrepreneurs in your industry and beyond
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, startup, or bio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Funding Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Stage
                </label>
                <select
                  value={selectedFundingStage}
                  onChange={(e) => setSelectedFundingStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Stages</option>
                  {fundingStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {users.length} {users.length === 1 ? 'founder' : 'founders'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Loading founders...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <button
            onClick={fetchUsers}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No founders found</div>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((founder) => (
            <ProfileCard
              key={founder._id}
              user={founder}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
