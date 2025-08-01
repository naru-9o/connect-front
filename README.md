# FounderConnect - Startup Founder Networking Platform

A comprehensive web application for startup founders to connect, network, and collaborate based on location, industry, and funding stage.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based registration and login
- **Profile Management**: Comprehensive founder profiles with startup details
- **Smart Networking**: Advanced filtering by location, industry, and funding stage
- **Real-time Messaging**: Socket.io powered chat with browser notifications
- **Event Discovery**: Interactive events with RSVP functionality and map integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Stack

#### Frontend
- **React.js** with Vite for fast development
- **Tailwind CSS** for responsive, modern UI
- **React Router DOM** for client-side routing
- **React Hook Form + Yup** for form validation
- **Socket.io Client** for real-time features
- **Axios** for API communication
- **Lucide React** for icons

#### Backend
- **Node.js + Express** REST API server
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/founderconnect
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/founderconnect
   
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📱 Usage

### Getting Started
1. **Register**: Create your founder profile with startup details
2. **Explore**: Browse and filter other founders by criteria
3. **Connect**: Send messages and start conversations
4. **Events**: Discover and RSVP to networking events
5. **Profile**: Keep your information updated

### Demo Credentials
For testing purposes, you can use:
- **Email**: sarah@techstartup.com
- **Password**: password123

## 🏗️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with filtering)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:userId` - Get messages with specific user
- `POST /api/messages` - Send a message
- `PUT /api/messages/read/:userId` - Mark messages as read

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id` - Delete event

## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB**: Install and run MongoDB locally
2. **MongoDB Atlas**: Create a cluster and get connection string
3. Update `MONGODB_URI` in server `.env` file

### Google Maps Integration
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API and Places API
3. Update `VITE_GOOGLE_MAPS_API_KEY` in frontend `.env`

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Deploy from GitHub repository
3. Ensure MongoDB Atlas connection

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Configure redirects for SPA routing

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Security headers with Helmet
- MongoDB injection protection

## 🎯 Future Enhancements

- [ ] Video calling integration
- [ ] Advanced search with Elasticsearch
- [ ] Push notifications
- [ ] File sharing in messages
- [ ] Event calendar integration
- [ ] Startup pitch deck sharing
- [ ] Investor matching
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Socket.io for real-time communication
- MongoDB for the flexible database
- All the open-source contributors

---

**Built with ❤️ for the startup community**