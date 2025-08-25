# DRX Frontend

This is a fresh Angular frontend project configured to integrate with a backend API running on port 4005.

## Features

- Angular 20+ with standalone components
- Proxy configuration for backend API integration
- Pre-configured API service for HTTP requests
- Example component demonstrating API integration

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```
   cd drx-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Development Server

To start the development server:

```
npm start
```

The application will be available at `http://localhost:4200/`.

The development server includes a proxy configuration that forwards API requests to your backend running on `http://localhost:4005/`.

## Backend Integration

The proxy is configured to forward requests to `/api/*` to your backend server. For example:
- Frontend request to `/api/users` will be forwarded to `http://localhost:4005/api/users`

## Code Structure

- `src/app/services/api.service.ts`: Service for making HTTP requests to the backend
- `src/app/components/data/data.component.ts`: Example component demonstrating API integration
- `proxy.conf.json`: Proxy configuration for backend integration

## Making API Requests

Use the provided `ApiService` to make requests to your backend. Replace 'endpoint' with your actual backend endpoints:

```typescript
// GET request
// Replace 'endpoint' with actual endpoint like 'users', 'products', etc.
this.apiService.getData('endpoint').subscribe(response => {
  console.log(response);
});

// POST request
// Replace 'endpoint' with actual endpoint like 'users', 'products', etc.
// Replace 'data' with actual data to send
this.apiService.postData('endpoint', data).subscribe(response => {
  console.log(response);
});
```

For example, if your backend has a '/api/users' endpoint, you would use:

```typescript
// GET all users
this.apiService.getData('users').subscribe(response => {
  console.log(response);
});

// Create a new user
const newUser = { name: 'John Doe', email: 'john@example.com' };
this.apiService.postData('users', newUser).subscribe(response => {
  console.log(response);
});
```

## Authentication

If your backend requires authentication, you can set the authentication token using the `setToken` method:

```typescript
// Set the authentication token
this.apiService.setToken('your-auth-token');

// After setting the token, all subsequent API requests will include the Authorization header
this.apiService.getData('users').subscribe(response => {
  console.log(response);
});
```

## Building for Production

To build the project for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.
