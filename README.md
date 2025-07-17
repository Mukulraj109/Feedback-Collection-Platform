# FeedbackPro - Full Stack Feedback Collection Platform

A comprehensive feedback collection platform that allows businesses to create custom forms and collect responses from customers via public URLs.

## 🚀 Features

### Admin Features
- **Authentication**: Secure JWT-based login and registration
- **Form Builder**: Create custom forms with text and multiple-choice questions
- **Dashboard**: View all forms with response statistics
- **Response Management**: View responses in tabular format with real-time analytics
- **CSV Export**: Export response data for further analysis
- **Form Sharing**: Generate public URLs for form submission

### Customer Features
- **Public Form Access**: Submit feedback without registration
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Validation**: Instant feedback on form submission

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/feedbackpro
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install dependencies** (from root directory):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

### Full Stack Development

To run both frontend and backend simultaneously:
```bash
npm run dev:full
```

## 🏗️ Architecture & Design Decisions

### Frontend Architecture
- **Component-based Architecture**: Modular React components with clear separation of concerns
- **Context API**: Centralized authentication state management
- **Custom Hooks**: Reusable logic for API calls and state management
- **TypeScript**: Strong typing for better development experience and error prevention

### Backend Architecture
- **RESTful API Design**: Clear endpoints following REST conventions
- **Middleware Pattern**: Authentication, CORS, and error handling middleware
- **Model-View-Controller**: Organized code structure with separate models, routes, and controllers
- **Database Indexing**: Optimized queries with proper indexing on frequently accessed fields

### Security Considerations
- **JWT Authentication**: Stateless authentication with secure token generation
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Restricted cross-origin requests to authorized domains

### Database Schema Design

#### User Model
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  timestamps: true
}
```

#### Form Model
```javascript
{
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  responseCount: Number,
  timestamps: true
}
```

#### FormResponse Model
```javascript
{
  formId: ObjectId (ref: Form),
  responses: Map<String, String>,
  ipAddress: String,
  userAgent: String,
  timestamps: true
}
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Forms
- `GET /api/forms` - Get all forms for authenticated user
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get specific form (authenticated)
- `GET /api/forms/public/:id` - Get public form (no auth)
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Responses
- `POST /api/responses` - Submit form response (public)
- `GET /api/responses/form/:formId` - Get responses for form
- `GET /api/responses/export/:formId` - Export responses as CSV

## 🎨 UI/UX Design Principles

### Design System
- **Color Palette**: Professional blue primary (#3B82F6) with supporting colors
- **Typography**: System fonts with consistent hierarchy
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable UI components with consistent styling

### Responsive Design
- **Mobile-first**: Optimized for mobile devices (320px+)
- **Tablet Support**: Enhanced layouts for tablet screens (768px+)
- **Desktop**: Full-featured experience for larger screens (1024px+)

### User Experience
- **Progressive Disclosure**: Complex features revealed contextually
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages with recovery options
- **Accessibility**: Semantic HTML with proper ARIA labels

## 🔧 Development Workflow

### Code Organization
- **Frontend**: Component-based structure with shared utilities
- **Backend**: Feature-based organization with clear separation
- **Types**: Centralized TypeScript definitions
- **Styles**: Utility-first CSS with Tailwind

### Testing Strategy
- **Frontend**: Component testing with React Testing Library
- **Backend**: API endpoint testing with Jest/Supertest
- **Integration**: End-to-end testing for critical user flows

### Performance Optimizations
- **Frontend**: Code splitting, lazy loading, and memoization
- **Backend**: Database indexing and query optimization
- **Caching**: Strategic use of browser and server caching

## 🚀 Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy `dist` folder to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment
1. Set production environment variables
2. Deploy to cloud provider (Heroku, Railway, DigitalOcean, etc.)
3. Ensure MongoDB connection is configured for production

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=your-production-frontend-url
```

## 📈 Future Enhancements

### Planned Features
- **Advanced Analytics**: Response trends and insights
- **Form Templates**: Pre-built form templates for common use cases
- **Team Collaboration**: Multi-user access with role-based permissions
- **Integrations**: Webhook support and third-party integrations
- **Advanced Question Types**: File uploads, ratings, date pickers

### Performance Improvements
- **Caching Layer**: Redis integration for improved performance
- **CDN Integration**: Asset optimization and delivery
- **Real-time Updates**: WebSocket integration for live response updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions and support, please open an issue in the GitHub repository or contact the development team.

---

**the Full Stack Intern Assignment**