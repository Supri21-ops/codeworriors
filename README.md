# 🏭 Manufacturing Management System - CodeWarriors

A comprehensive manufacturing management system built for the Odoo Hackathon, featuring real-time order tracking, inventory management, and production planning.

## 🚀 Team Members

- **V Uday** - Team Lead
- **Jayant** - Backend Developer  
- **Soma Manoj** - Frontend Developer
- **Suprith YS** - Full Stack Developer
- **Aman Patel** - Collaborator

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Icons** for UI elements

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Prisma** ORM with PostgreSQL
- **JWT** authentication
- **Redis** for caching
- **Kafka** for event streaming

### Infrastructure
- **Docker** containerization
- **PostgreSQL** database
- **Redis** cache
- **Kafka** message broker
- **Nginx** reverse proxy

## 📁 Project Structure

```
codeworriors/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── theme.ts         # Design system
│   │   └── App.tsx          # Main application
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── modules/         # Feature modules
│   │   ├── middleware/      # Express middleware
│   │   ├── libs/           # Utility libraries
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md
```

## 🎯 Key Features

### Manufacturing Orders
- Create and manage manufacturing orders
- Priority-based scheduling
- Real-time status tracking
- Work order generation

### Work Orders
- Detailed work order management
- Work center assignment
- User assignment and tracking
- Progress monitoring

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Stock movement history
- Multi-location inventory

### User Management
- Role-based access control
- User authentication
- Profile management
- Activity tracking

### Dashboard & Analytics
- KPI monitoring
- Production metrics
- Real-time charts
- Customizable views

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Supri21-ops/codeworriors.git
   cd codeworriors
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Docs: http://localhost:3000/api/docs

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### Manufacturing Orders
- `GET /api/manufacturing/orders` - List orders
- `POST /api/manufacturing/orders` - Create order
- `GET /api/manufacturing/orders/:id` - Get order details
- `PUT /api/manufacturing/orders/:id` - Update order
- `DELETE /api/manufacturing/orders/:id` - Delete order

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🗄️ Database Schema

The system uses PostgreSQL with Prisma ORM. Key entities include:

- **Users** - User management and authentication
- **Products** - Product catalog
- **Manufacturing Orders** - Production orders
- **Work Orders** - Detailed work assignments
- **Work Centers** - Production facilities
- **Stock Items** - Inventory management
- **Bills of Materials** - Product composition
- **Events** - System notifications

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/manufacturing_db
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
```

#### Frontend
```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd Frontend
npm test
```

## 📦 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd Frontend
npm run build
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Submission

This project was developed for the Odoo Hackathon with a focus on:

- **Manufacturing Excellence** - Streamlined production management
- **Real-time Visibility** - Live tracking and monitoring
- **Scalable Architecture** - Modern tech stack for growth
- **User Experience** - Intuitive and responsive design

## 📞 Support

For support and questions, please contact the CodeWarriors team or create an issue in the repository.

---

**Built with ❤️ by CodeWarriors Team**