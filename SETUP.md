# KachaBazar E-Commerce Setup Guide

## Project Status ✅

The project has been **successfully debugged and stabilized**:
- ✅ Backend server runs without errors
- ✅ JWT authentication implemented
- ✅ MongoDB connection working
- ✅ User registration/login functional
- ✅ Product CRUD operations working
- ✅ Frontend configured to connect to backend
- ✅ VS Code tasks created for easy development

## Prerequisites

1. **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
3. **Git** (optional) - For version control

## Quick Setup

### 1. Install MongoDB
- Download and install MongoDB Community Server
- Start MongoDB service:
  ```bash
  # Windows (as Administrator)
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

### 2. Setup Backend
```bash
cd kachabazar-backend
npm install
npm run dev   # Or: node server.js
```

The backend will start on http://localhost:5000

**Available API endpoints:**
- `GET /health` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/products/all-products` - Get all products
- `POST /api/products/add-product` - Add product (protected)
- `GET /api/products/my-products` - Get user's products (protected)
- `PUT /api/products/update-product/:id` - Update product (protected)
- `DELETE /api/products/delete-product/:id` - Delete product (protected)

### 3. Setup Frontend
```bash
cd kachabazar-frontend
npm install
npm run dev
```

The frontend will start on http://localhost:3000

### 4. Test the Backend API
You can test the backend API functionality:
```bash
cd kachabazar-backend
node test-api.js
```

This will run comprehensive tests on all API endpoints.

## VS Code Development

The project includes VS Code tasks for easier development:

1. **Start Backend Server**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Backend Server"
2. **Start Frontend Server**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Frontend Server"  
3. **Test Backend API**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Test Backend API"

Or use the Command Palette shortcuts:
- `Ctrl+Shift+P` → "Tasks: Run Build Task" to see all available tasks

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kachabazar
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**: Make sure MongoDB is running
2. **Port Already in Use**: Change PORT in .env or kill existing process
3. **CORS Issues**: Frontend and backend URLs are configured in environment variables
4. **JWT Token Issues**: Make sure JWT_SECRET is set in backend .env

### Reset Database:
```bash
# Connect to MongoDB and drop the database
mongo
use kachabazar
db.dropDatabase()
```

## Next Steps for Production

1. **Security Enhancements**
   - Add rate limiting
   - Implement email verification
   - Add password reset functionality
   - Use HTTPS in production

2. **Additional Features**
   - Product reviews and ratings
   - Advanced search with Elasticsearch
   - Payment gateway integration
   - Real-time notifications
   - Admin dashboard
   - Inventory management

3. **Performance Optimization**
   - Image compression and CDN
   - Database indexing
   - API caching
   - Code splitting

4. **Deployment**
   - Containerize with Docker
   - Deploy to cloud platforms (AWS, Vercel, etc.)
   - Set up CI/CD pipeline
   - Configure monitoring and logging

## Support

For issues or questions, please check:
1. This setup guide
2. Console logs for error messages
3. Network tab for API call failures
4. MongoDB logs for database issues
