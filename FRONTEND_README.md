# CodeWarrior Manufacturing Management System - Frontend

A modern, professional frontend application built with React, TypeScript, and Tailwind CSS for the CodeWarrior Manufacturing Management System.

## 🚀 Features

### 🎨 Professional UI/UX
- **Modern Design System**: Consistent, accessible, and beautiful interface
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Built-in theme switching capability
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and micro-interactions for better user experience

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different access levels for Admin, Manager, Supervisor, Operator, and User
- **Protected Routes**: Automatic redirection based on authentication status
- **Session Management**: Automatic token refresh and logout handling

### 📊 Dashboard & Analytics
- **Real-time Dashboard**: Live data updates with key performance indicators
- **Interactive Charts**: Production overview with Recharts integration
- **Priority Queue**: Visual representation of work order priorities
- **Quick Actions**: Fast access to common operations
- **Notifications**: Real-time alerts and system notifications

### 🏭 Manufacturing Management
- **Order Management**: Complete CRUD operations for manufacturing orders
- **Work Order Tracking**: Detailed work order management and scheduling
- **Priority System**: Dynamic priority calculation and queue management
- **Status Tracking**: Real-time status updates and progress monitoring
- **Search & Filtering**: Advanced search with multiple filter options

### 🔍 Advanced Features
- **Vector Search**: Intelligent search using AI-powered vector embeddings
- **Real-time Updates**: Live data synchronization with backend
- **Bulk Operations**: Efficient handling of multiple records
- **Export/Import**: Data export capabilities for reporting
- **Audit Trail**: Complete history tracking for all operations

## 🛠 Technology Stack

### Core Technologies
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Fast build tool and development server
- **React Router v6**: Modern routing with data loading

### UI/UX Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful SVG icons
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive charts and data visualization

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management and caching
- **React Hook Form**: Performant forms with validation

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Vite**: Fast development and building

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Input, Card, etc.)
│   │   ├── layout/        # Layout components (Sidebar, Topbar, etc.)
│   │   └── dashboard/     # Dashboard-specific components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── manufacturing/ # Manufacturing pages
│   │   └── ...
│   ├── services/          # API services and utilities
│   ├── store/             # State management (Zustand stores)
│   ├── design-system/     # Design system tokens and utilities
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeworriors/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   ```
   http://localhost:3001
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Main brand color
- **Secondary**: Green (#22c55e) - Success and positive actions
- **Accent**: Yellow (#f59e0b) - Warnings and highlights
- **Neutral**: Gray scale for text and backgrounds
- **Status Colors**: Specific colors for different states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Responsive**: Scales appropriately across devices

### Components
- **Consistent API**: All components follow the same design patterns
- **Accessibility**: Built with accessibility in mind
- **Customizable**: Easy to theme and customize
- **Responsive**: Mobile-first design approach

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Application Configuration
VITE_APP_NAME=CodeWarrior Manufacturing
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Component-specific utilities

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Optimized navigation
- Responsive tables and charts

## 🔐 Security Features

### Authentication
- JWT token management
- Automatic token refresh
- Secure token storage
- Session timeout handling

### Authorization
- Role-based access control
- Route protection
- Component-level permissions
- API request authorization

### Data Protection
- Input validation
- XSS protection
- CSRF protection
- Secure API communication

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports
- Bundle optimization

### Caching
- React Query caching
- Browser caching
- Service worker (PWA ready)
- Optimized asset loading

### Bundle Size
- Tree shaking
- Dead code elimination
- Optimized dependencies
- Compression

## 🧪 Testing

### Testing Strategy
- Unit tests for components
- Integration tests for features
- E2E tests for critical paths
- Visual regression testing

### Running Tests
```bash
npm run test
npm run test:coverage
npm run test:e2e
```

## 📦 Deployment

### Docker Deployment
```bash
docker build -t codewarrior-frontend .
docker run -p 3001:3001 codewarrior-frontend
```

### Static Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Environment-specific Builds
```bash
npm run build:development
npm run build:staging
npm run build:production
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Include tests for new features

## 📚 Documentation

### Component Documentation
- Storybook integration
- Interactive component examples
- API documentation
- Usage guidelines

### API Documentation
- Swagger/OpenAPI integration
- Request/response examples
- Error handling
- Authentication guide

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check TypeScript errors

2. **API Connection Issues**
   - Verify backend is running
   - Check API URL configuration
   - Check CORS settings

3. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify class names
   - Check for CSS conflicts

### Debug Mode
Enable debug mode by setting `VITE_ENABLE_DEBUG=true` in your environment variables.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Headless UI for accessible components
- All contributors and maintainers

---

**Built with ❤️ by the CodeWarrior Team**
