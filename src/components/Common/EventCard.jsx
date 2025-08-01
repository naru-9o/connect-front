import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, Pencil, Trash } from 'lucide-react';

const EventCard = ({
  event,
  onRSVP,
  isAttending = false,
  isOwner = false,
  onEdit,
  onDelete
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
     <img
        src={event.image} // Changed from event.bannerImage?.image to event.image
        alt={event.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/placeholder-image.jpg'; // Add a fallback image
        }}
    />
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{event.attendees.length}/{event.maxAttendees} attending</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {isOwner ? (
          <div className="flex justify-between space-x-2">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center bg-yellow-400 text-white px-4 py-2 rounded-2xl hover:bg-yellow-600"
            >
              <Pencil size={16} className="mr-2" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-700"
            >
              <Trash size={16} className="mr-2" />
              Delete
            </button>
          </div>
        ) : (
          onRSVP && (
            <button
              onClick={() => onRSVP(event._id)}
              disabled={event.attendees.length >= event.maxAttendees && !isAttending}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                isAttending
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : event.attendees.length >= event.maxAttendees
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAttending ? 'Attending' : 'RSVP'}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EventCard;
