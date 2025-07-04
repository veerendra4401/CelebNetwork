# Celebrity Fan Connect Platform

A full-stack application that connects celebrities with their fans, featuring real-time notifications, personalized dashboards, and AI-powered celebrity suggestions.

## 🌟 Features

- **Celebrity Profiles**
  - AI-powered celebrity suggestions
  - Automated profile completion using multiple data sources
  - Performance and event tracking

- **Fan Experience**
  - Real-time notifications
  - Personalized dashboards
  - PDF generation for celebrity information

- **Authentication & Security**
  - JWT-based authentication
  - Role-based access control
  - Secure API endpoints

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT.
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: Google's Gemini AI

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: JWT with HTTP-only cookies

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional, for containerization)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd nest
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Backend (.env):
   ```env
   # Database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=celebrity_fan_db

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=24h

   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start Development Servers**

   Backend:
   ```bash
   cd backend
   npm run start:dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## 📚 API Documentation

The API documentation is available through Swagger UI when running the backend server:
- Development: http://localhost:3000/api/docs

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Celebrities
- `GET /celebrities` - List all celebrities
- `GET /celebrities/:id` - Get celebrity details
- `POST /celebrities` - Create celebrity profile
- `PUT /celebrities/:id` - Update celebrity profile

#### Fans
- `GET /fans/dashboard` - Get fan dashboard
- `POST /fans/follow/:celebrityId` - Follow a celebrity
- `GET /fans/notifications` - Get fan notifications

## 🔧 Configuration

### Backend Configuration (nest-cli.json)
```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
```

### Frontend Configuration (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration
}
```

## 🚢 Deployment

### Backend Deployment (AWS Lambda)

1. Configure AWS credentials:
   ```bash
   aws configure
   ```

2. Deploy using Serverless Framework:
   ```bash
   cd backend
   npm run deploy
   ```

### Frontend Deployment (Vercel)

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## 🧪 Testing

### Backend Tests
```bash
cd backend
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📱 Demo

- **Live Demo**: [Demo Link]
- **Video Walkthrough**: [Loom Video Link]
- **GitHub Repository**: [Repository Link]

## 📄 API Documentation

For detailed API documentation, please visit:
- Production: [API Docs Link]
- Development: http://localhost:3000/api/docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [Your GitHub Profile]

## 🙏 Acknowledgments

- NestJS Team
- Next.js Team
- Google Gemini AI Team
- All contributors and supporters 
