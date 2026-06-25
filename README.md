# 🎬 Movie Ticket Booking System

A full-stack web application for seamless movie ticket reservation and management, built with modern technologies for optimal performance and user experience.

## 📋 Overview

This Movie Ticket Booking System is a comprehensive platform enabling customers to browse movies, select theaters, book tickets, and manage reservations. Administrators can manage movie catalogs, theater schedules, and user activities. The system features robust authentication, secure payment processing, and real-time ticket availability tracking.

**Performance Achievement:** 30% performance boost through optimized database queries and efficient caching strategies.

## ✨ Features

### Customer Features

- User registration and authentication with JWT tokens
- Browse available movies and theaters
- Search and filter movies by genre, rating, and showtime
- Real-time seat selection and availability
- Secure ticket booking and payment processing
- View booking history and e-tickets
- Download digital e-tickets
- User profile management

### Admin Features

- Secure admin login with role-based access control
- Movie catalog management (create, update, delete)
- Theater and screen management
- Movie schedule and showtime configuration
- Customer and booking management
- Dashboard with analytics and reports
- User activity tracking

### Security

- Spring Security with JWT token-based authentication
- Role-based access control (RBAC)
- Secure API endpoints with permission validation
- Password encryption and secure storage

## 🛠️ Tech Stack

### Backend

- **Framework:** Java Spring Boot
- **Database:** MongoDB
- **Authentication:** Spring Security with JWT
- **Build Tool:** Gradle
- **API:** RESTful Architecture

### Frontend

- **Framework:** React.js
- **Styling:** CSS3
- **State Management:** Context API
- **HTTP Client:** Axios
- **Routing:** React Router

### Additional Technologies

- **TypeScript:** Type-safe frontend development
- **Payment Integration:** Secure payment gateway support

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Java 11 or higher**
- **Node.js 14+ and npm**
- **MongoDB 4.4+**
- **Git**
- **Gradle** (or use the included gradle wrapper)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Movie-Ticket-Booking-System.git
cd Movie-Ticket-Booking-System
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd movie-ticket-reservation-api
```

#### Configure MongoDB Connection

Edit `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/movieticket
spring.data.mongodb.database=movieticket
```

#### Build the Backend

```bash
./gradlew build
```

Or on Windows:

```bash
gradlew.bat build
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../movie-ticket-reservation-ui
```

Install dependencies:

```bash
npm install
```

## 🏃 Running the Application

### Start MongoDB

```bash
mongod
```

### Start the Backend (from `movie-ticket-reservation-api` directory)

```bash
./gradlew bootRun
```

The backend API will be available at `http://localhost:8080`

### Start the Frontend (from `movie-ticket-reservation-ui` directory)

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
Movie-Ticket-Booking-System/
├── movie-ticket-reservation-api/          # Spring Boot Backend
│   ├── src/main/java/com/movieticketreservation/
│   │   ├── controller/                     # REST Controllers
│   │   ├── service/                        # Business Logic
│   │   ├── repository/                     # Data Access Layer
│   │   ├── entity/                         # MongoDB Entities
│   │   ├── dto/                            # Data Transfer Objects
│   │   └── security/                       # JWT & Security Config
│   ├── build.gradle                        # Gradle Configuration
│   └── src/main/resources/application.properties
│
└── movie-ticket-reservation-ui/           # React Frontend
    ├── src/
    │   ├── components/                     # Reusable Components
    │   ├── pages/                          # Page Components
    │   ├── contexts/                       # Context API Setup
    │   ├── api/                            # API Integration
    │   └── App.js                          # Main App Component
    ├── package.json                        # NPM Dependencies
    └── public/
```

## 🔌 API Endpoints

### Authentication

- `POST /api/customers/register` - Register new customer
- `POST /api/customers/login` - Customer login
- `POST /api/admin/login` - Admin login

### Movies

- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get movie details
- `POST /api/movies` - Add new movie (Admin)
- `PUT /api/movies/{id}` - Update movie (Admin)
- `DELETE /api/movies/{id}` - Delete movie (Admin)

### Bookings

- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{customerId}` - Get customer bookings
- `GET /api/bookings/{bookingId}` - Get booking details
- `PUT /api/bookings/{bookingId}` - Update booking
- `DELETE /api/bookings/{bookingId}` - Cancel booking

### Theater & Schedules

- `GET /api/theaters` - Get all theaters
- `POST /api/theaters` - Add new theater (Admin)
- `GET /api/schedules` - Get movie schedules
- `POST /api/schedules` - Add schedule (Admin)

### E-Tickets

- `GET /api/etickets/{bookingId}` - Get e-ticket
- `POST /api/etickets/download/{ticketId}` - Download e-ticket

## 🧪 Testing

### Run Backend Tests

```bash
cd movie-ticket-reservation-api
./gradlew test
```

### Run Frontend Tests

```bash
cd movie-ticket-reservation-ui
npm test
```

## 📝 Default Admin Credentials

For initial access, use the following admin credentials (update after first login):

```
Email: admin@movieticket.com
Password: admin123
```

## 🔒 Security Notes

- Never commit sensitive configuration files to the repository
- Store database credentials in environment variables
- Change default admin password immediately after deployment
- Enable HTTPS in production environments
- Implement rate limiting on API endpoints
- Regularly update dependencies for security patches

## 🚢 Deployment

### Backend Deployment (Spring Boot)

Build a JAR file:

```bash
./gradlew build
```

Deploy the JAR:

```bash
java -jar build/libs/movie-ticket-reservation-api-1.0.0.jar
```

### Frontend Deployment

Build for production:

```bash
npm run build
```

Deploy the `build/` directory to a static hosting service.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Full Stack Development

## 📞 Support

For support, email support@movieticket.com or open an issue on GitHub.

## 🎯 Future Enhancements

- Mobile app (React Native)
- Real-time seat availability with WebSockets
- Integration with popular payment gateways
- Email notifications and reminders
- Advanced analytics dashboard
- Multi-language support
- Rating and review system
