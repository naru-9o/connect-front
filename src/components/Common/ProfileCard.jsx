import React from 'react';
import { MapPin, Building, DollarSign, MessageSquare } from 'lucide-react';

const ProfileCard = ({ 
  user, 
  onMessageClick, 
  showMessageButton = true 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-blue-600 font-medium">{user.startupName}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Building size={16} className="mr-2" />
            <span>{user.industry}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={16} className="mr-2" />
            <span>{user.fundingStage}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>{user.location}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {user.bio}
        </p>

        {showMessageButton && onMessageClick && (
          <button
            onClick={() => onMessageClick(user._id)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <MessageSquare size={16} />
            <span>Send Message</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;