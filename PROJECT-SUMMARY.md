# TalentLink - College Project Documentation

## Project Overview
**TalentLink** is a freelance marketplace web application built as a full-stack project demonstrating modern web development skills.

## Technology Stack
- **Frontend**: React.js with Vite (Fast development)
- **Backend**: Node.js with Express.js (RESTful API)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: SASS/SCSS

## Key Features Implemented
1. **User Authentication System**
   - User registration and login
   - JWT-based authentication
   - Password hashing with bcrypt

2. **Dual User Roles**
   - Buyers: Can browse and purchase services
   - Sellers: Can create and manage service offerings

3. **Gig Management System**
   - Create, read, update, delete operations
   - Category-based filtering
   - Price range filtering
   - Search functionality

4. **Database Design**
   - 6 normalized tables (users, gigs, orders, conversations, messages, reviews)
   - Foreign key relationships
   - ACID compliance

5. **RESTful API Design**
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - JSON data exchange
   - Proper status codes
   - Error handling

## Project Structure
```
TalentLink/
├── api/              # Backend server
├── client/           # React frontend
├── README.md         # Documentation
└── simple-setup.js   # One-command setup
```

## Database Schema
- **Users**: Store user profiles and authentication data
- **Gigs**: Service offerings with pricing and details
- **Orders**: Transaction records
- **Conversations & Messages**: Basic messaging system
- **Reviews**: Rating and feedback system

## Setup Instructions
1. Clone repository
2. Run: `cd api && node simple-setup.js`
3. Start backend: `npm start`
4. Start frontend: `cd client && npm install && npm run dev`

## Learning Outcomes
- Full-stack web development
- Database design and relationships
- RESTful API development
- Modern JavaScript (ES6+)
- React component architecture
- Authentication and security
- Version control with Git

## Technologies Learned
- **Frontend**: React Hooks, Component lifecycle, State management
- **Backend**: Express middleware, Route handlers, Database queries
- **Database**: SQL, Relationships, Migrations
- **Security**: JWT tokens, Password hashing, CORS
- **Tools**: npm, Git, PostgreSQL, Postman (API testing)

---
*This project demonstrates practical application of web development concepts learned in college coursework.*
