export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@techstartup.com',
    startupName: 'EcoTech Solutions',
    industry: 'CleanTech',
    fundingStage: 'Seed',
    location: 'San Francisco, CA',
    bio: 'Building sustainable technology solutions for a greener future. Former Google engineer with 8 years of experience.',
    profileImage: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@healthapp.com',
    startupName: 'HealthBridge',
    industry: 'HealthTech',
    fundingStage: 'Series A',
    location: 'Austin, TX',
    bio: 'Democratizing healthcare access through innovative mobile solutions. Medical doctor turned entrepreneur.',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@financeai.com',
    startupName: 'FinanceAI',
    industry: 'FinTech',
    fundingStage: 'Pre-Seed',
    location: 'New York, NY',
    bio: 'Using AI to make personal finance management accessible to everyone. Former Goldman Sachs analyst.',
    profileImage: 'https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@eduplatform.com',
    startupName: 'LearnTogether',
    industry: 'EdTech',
    fundingStage: 'Seed',
    location: 'Seattle, WA',
    bio: 'Revolutionizing online education with peer-to-peer learning platforms. Former Microsoft product manager.',
    profileImage: 'https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa@foodtech.com',
    startupName: 'FreshFood',
    industry: 'FoodTech',
    fundingStage: 'Series A',
    location: 'Los Angeles, CA',
    bio: 'Connecting local farmers with urban consumers through our innovative supply chain platform.',
    profileImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-12'
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Startup Pitch Night',
    description: 'Join us for an evening of innovative startup pitches and networking with fellow entrepreneurs.',
    date: '2025-02-15',
    time: '18:00',
    location: 'TechHub San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    organizer: 'TechHub SF',
    attendees: ['1', '3', '4'],
    maxAttendees: 50,
    tags: ['Networking', 'Pitching', 'Venture Capital'],
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'HealthTech Founders Meetup',
    description: 'Monthly gathering for healthcare technology entrepreneurs to share insights and collaborate.',
    date: '2025-02-18',
    time: '19:00',
    location: 'Austin Convention Center',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    organizer: 'Austin HealthTech',
    attendees: ['2', '5'],
    maxAttendees: 30,
    tags: ['HealthTech', 'Networking', 'Innovation'],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'FinTech Summit 2025',
    description: 'Two-day summit featuring the latest trends in financial technology and regulatory updates.',
    date: '2025-03-01',
    time: '09:00',
    location: 'New York Financial District',
    coordinates: { lat: 40.7074, lng: -74.0113 },
    organizer: 'FinTech Alliance',
    attendees: ['1', '2', '3'],
    maxAttendees: 200,
    tags: ['FinTech', 'Summit', 'Regulation'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockMessages = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi Sarah! I saw your EcoTech Solutions profile. Would love to connect and discuss potential collaboration opportunities.',
    timestamp: '2025-01-20T10:30:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Hi Marcus! Thanks for reaching out. I\'d be interested in learning more about HealthBridge. Are you available for a quick call this week?',
    timestamp: '2025-01-20T14:45:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'Absolutely! I\'m free Thursday afternoon. How does 2 PM PST work for you?',
    timestamp: '2025-01-20T15:20:00Z',
    read: false
  }
];

export const industries = [
  'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'FoodTech', 
  'PropTech', 'RetailTech', 'AI/ML', 'Blockchain', 'IoT', 'SaaS', 'E-commerce'
];

export const fundingStages = [
  'Idea Stage', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth Stage'
];

export const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 
  'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 
  'Miami, FL', 'Atlanta, GA', 'Remote', 'Other'
];