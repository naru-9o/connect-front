import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, Filter, Plus } from 'lucide-react';
import EventCard from '../components/Common/EventCard';
import { industries } from '../services/mockData';
import { eventsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    tags: '',
    image: null,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedIndustry) params.tags = selectedIndustry;
      const response = await eventsAPI.getEvents(params);

      if (response.data.success) {
        setEvents(response.data.events);
        const userAttendingEvents = response.data.events
          .filter(event => event.attendees.some(attendee =>
            (typeof attendee === 'string' ? attendee : attendee._id) === user?._id
          ))
          .map(event => event._id);
        setAttendingEvents(userAttendingEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, searchTerm, selectedIndustry]);

  const handleRSVP = async (eventId) => {
    try {
      const response = await eventsAPI.rsvpEvent(eventId);
      if (response.data.success) {
        const updatedEvent = response.data.event;
        const isNowAttending = updatedEvent.attendees.some(attendee =>
          (typeof attendee === 'string' ? attendee : attendee._id) === user?._id
        );
        setEvents(prev => prev.map(event => event._id === eventId ? updatedEvent : event));
        if (isNowAttending) {
          setAttendingEvents(prev => [...prev, eventId]);
        } else {
          setAttendingEvents(prev => prev.filter(id => id !== eventId));
        }
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP. Please try again.');
    }
  };

  const clearFilters = () => {
    setSelectedIndustry('');
    setSearchTerm('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const max = parseInt(formData.maxAttendees);
  if (isNaN(max) || max < 1 || max > 1000) {
      toast.warning("⚠️ Max Attendees must be a number between 1 and 1000");
    return;
  }

  const tagsArray = formData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const token = localStorage.getItem('token');
  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('date', formData.date);
  data.append('time', formData.time);
  data.append('location', formData.location);
  data.append('maxAttendees', max);
  tagsArray.forEach(tag => data.append('tags', tag));

  if (formData.image) {
    data.append('image', formData.image);
  }

  try {
    let response;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ DO NOT manually set Content-Type for FormData
      },
    };

    if (editingEventId) {
      response = await eventsAPI.updateEvent(editingEventId, data, config);
    } else {
      response = await eventsAPI.createEvent(data, config);
    }

    if (response.data.success) {
      toast.success(editingEventId ? 'Event updated successfully!' : 'Event created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxAttendees: '',
        tags: '',
        image: null
      });
      setEditingEventId(null);
      fetchEvents();
    }
  } catch (error) {
    console.error("❌ Error saving event:", error);
    toast.error("❌ Failed to save the event. Please try again.");
  }
};



  const handleEdit = (event) => {
      setEditingEventId(event._id);
      setShowForm(true);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0],
        time: event.time,
        location: event.location,
        maxAttendees: event.maxAttendees,
        tags: event.tags.join(', '),
        image: null // image will be re-uploaded
      });
  };

  const handleDelete = async (eventId) => {
    // Show a confirmation toast with custom logic
    toast.info('Click again to confirm deletion...', {
      toastId: `delete-${eventId}`, // prevent duplicate toasts
      autoClose: 2000,
    });

    // Delay to simulate double-click/confirmation (optional behavior)
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await eventsAPI.deleteEvent(eventId, token);

        if (response.data.success) {
          setEvents(prev => prev.filter(event => event._id !== eventId));
          toast.success('Event deleted successfully!');
        } else {
          toast.error('Failed to delete the event.');
        }
      } catch (error) {
        console.error('❌ Error deleting event:', error);
        toast.error('⚠️ An error occurred while deleting the event.');
      }
    }, 2100); // small delay to mimic confirmation
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-gray-600">
            Discover networking events, pitch nights, and meetups in your area
          </p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="mr-2" size={18} />
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-10">
          <input name="title" placeholder="Title" required value={formData.title} onChange={handleChange} className="w-full border p-2" />
          <textarea name="description" placeholder="Description" required value={formData.description} onChange={handleChange} className="w-full border p-2" />
          <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full border p-2" />
          <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full border p-2" />
          <input name="location" placeholder="Location" required value={formData.location} onChange={handleChange} className="w-full border p-2" />
          <input name="maxAttendees" type="number" placeholder="Max Attendees" required value={formData.maxAttendees} onChange={handleChange} className="w-full border p-2" />
          <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="w-full border p-2" />
          <input type="file" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))} className="w-full border p-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Event</button>
        </form>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry Focus</label>
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
            </div>
            <div className="flex justify-end mt-4">
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

      {/* Events List */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {events.length} {events.length === 1 ? 'event' : 'events'}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Upcoming Events</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Loading events...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <button onClick={fetchEvents} className="text-blue-600 hover:text-blue-800 transition-colors">Try Again</button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No events found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRSVP={handleRSVP}
              isAttending={attendingEvents.includes(event._id)}
              isOwner={event.organizer?._id === user?._id}
              onEdit={() => handleEdit(event)}
              onDelete={() => handleDelete(event._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
