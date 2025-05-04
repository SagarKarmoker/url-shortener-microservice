# URL Shortener Microservice

A modern URL shortening service built with a microservices architecture, featuring URL shortening capabilities and comprehensive analytics tracking.

## Features

- URL shortening with custom short code generation
- Analytics tracking for shortened URLs including:
  - Device type detection
  - Browser identification
  - Location tracking
  - Referrer tracking
  - IP address logging
  - Timestamp recording
- Microservices architecture with separate services for URL management and analytics
- Message queue integration for reliable analytics processing

## Architecture

The project consists of two main microservices:

### URL Service
- Handles URL shortening and redirection
- Built with Express.js
- Uses MongoDB for URL storage
- Integrates with RabbitMQ for analytics events

### Analytics Service
- Processes and stores URL access analytics
- Uses MongoDB for analytics data storage
- Consumes analytics events from RabbitMQ

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SagarKarmoker/url-shortener-microservice.git
cd url-shortener-microservice
```

2. Install dependencies for both services:
```bash
# Install URL Service dependencies
cd url-service
npm install

# Install Analytics Service dependencies
cd ../analytics-service
npm install
```

3. Set up environment variables:

Create `.env` files in both service directories with the following variables:

**URL Service (.env)**:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
RABBITMQ_URL=amqp://localhost
```

**Analytics Service (.env)**:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/url-analytics
RABBITMQ_URL=amqp://localhost
```

## Usage

1. Start the services:

```bash
# Start URL Service
cd url-service
npm start

# Start Analytics Service
cd ../analytics-service
npm start
```

2. The URL service will be available at `http://localhost:3000`

## API Endpoints

### URL Service

#### Create Short URL
- **POST** `/api/shorten`
  ```json
  {
    "originalUrl": "https://example.com/very-long-url"
  }
  ```

#### Redirect to Original URL
- **GET** `/:shortCode`

### Analytics Service

#### Get URL Analytics
- **GET** `/api/analytics/:shortUrlId`

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Message Queue**: RabbitMQ
- **Other Tools**: CORS, Morgan (logging)

## License

ISC
