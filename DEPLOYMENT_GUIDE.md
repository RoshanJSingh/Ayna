# Deployment Guide - AYNA Feedback Platform

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Ayna
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
```bash
# Copy the environment example file
cp .env.example .env

# Edit .env with your actual values:
# - JWT_SECRET: Use a strong random string
# - MONGODB_URI: Your MongoDB connection string
# - PORT: Server port (default: 5000)
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Running the Application
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment
1. Upload backend files to your server
2. Install dependencies: `npm install --production`
3. Set environment variables in `.env`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ayna-backend"
   ```

#### Frontend Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Upload the `build` folder to your web server
3. Configure your web server to serve the static files

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-secret-key
      - MONGODB_URI=mongodb://mongo:27017/feedback-platform
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
  
  mongo:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
    
volumes:
  mongodb_data:
```

### Option 3: Cloud Deployment (Heroku)

#### Backend (Heroku)
1. Install Heroku CLI
2. Create a new Heroku app:
   ```bash
   heroku create ayna-backend
   ```
3. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set MONGODB_URI=your-mongodb-uri
   ```
4. Deploy:
   ```bash
   git subtree push --prefix backend heroku master
   ```

#### Frontend (Netlify/Vercel)
1. Build the frontend locally
2. Upload the `build` folder to Netlify or Vercel
3. Configure environment variables for API endpoint

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-very-long-random-secret-key
MONGODB_URI=mongodb://localhost:27017/feedback-platform
PORT=5000
NODE_ENV=production
```

### Frontend (if using environment variables)
```
REACT_APP_API_URL=http://localhost:5000
```

## Security Considerations

1. **JWT Secret**: Use a strong, random secret key (at least 32 characters)
2. **Database Security**: 
   - Use MongoDB authentication
   - Whitelist IP addresses
   - Use SSL/TLS connections
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Performance Optimization

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Caching**: Implement Redis caching for frequently accessed data
3. **CDN**: Use a CDN for static assets
4. **Compression**: Enable gzip compression
5. **Monitoring**: Set up application monitoring (New Relic, DataDog, etc.)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB service is running
   - Verify connection string
   - Check firewall settings

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **CORS Errors**
   - Check CORS configuration in backend
   - Verify API endpoint URLs

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Health Check Endpoints

Backend health check: `GET /api/health`
Response: `{"status": "OK", "timestamp": "2024-01-01T00:00:00.000Z"}`

## Backup Strategy

1. **Database Backups**: 
   - Schedule regular MongoDB backups
   - Store backups in multiple locations
   
2. **Code Backups**:
   - Use Git with remote repositories
   - Tag releases for rollback capability

3. **Environment Backups**:
   - Document all environment variables
   - Store configuration securely

## Monitoring and Logging

1. **Application Logs**:
   - Use structured logging (Winston)
   - Set up log rotation
   - Monitor error rates

2. **Performance Metrics**:
   - Response times
   - Database query performance
   - Memory and CPU usage

3. **Uptime Monitoring**:
   - Set up health checks
   - Configure alerts for downtime

## Scaling Considerations

1. **Horizontal Scaling**:
   - Use load balancers
   - Implement session storage (Redis)
   - Consider microservices architecture

2. **Database Scaling**:
   - MongoDB sharding
   - Read replicas
   - Connection pooling

3. **Caching Strategy**:
   - Redis for session storage
   - API response caching
   - Database query caching
