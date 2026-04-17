# Tourist Safety System - Backend

This is the backend for the Tourist Safety System, providing APIs for real-time location tracking and SOS emergency alerts. It integrates with a React Native mobile app and a React.js admin dashboard.

## Tech Stack
- **Node.js** & **Express.js** (Server)
- **Firebase Firestore** (Database)
- **Firebase Admin SDK** (Firebase connection)
- **dotenv** (Environment variables)
- **CORS** (Cross-origin requests)

## Prerequisites
- Node.js installed (v14+ recommended)
- Firebase project created with Firestore database enabled
- Firebase Service Account Key

## Setup Instructions

1. **Clone the repository and navigate to the backend directory**
   ```sh
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Firebase Setup**
   - Go to your [Firebase Console](https://console.firebase.google.com/).
   - Open your project and navigate to **Project settings > Service accounts**.
   - Click **Generate new private key** and save the downloaded JSON file to the `backend` directory.
   - Rename the file to `serviceAccountKey.json`.

4. **Environment Variables**
   - Copy `.env.example` to `.env`.
   - Update the configuration if necessary:
     ```env
     PORT=5000
     FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
     ```

## Running the Server

Start the server using:
```sh
npm start
```
*Note: Use `npm run dev` if you have `nodemon` installed and configured.*

## API Endpoints

### Test Route
- `GET /` - Returns "Backend is running"

### Location
- `POST /location-update` - Receive location updates from tourists.
- `GET /heatmap` - Retrieve heatmap data of tourist locations.

### Incidents (SOS)
- `POST /sos` - Trigger an SOS emergency alert.
- `GET /incidents` - Retrieve all incidents (sorted by latest).
- `PATCH /incident/:id` - Update an incident's status to "RESOLVED".

### Dashboard
- `GET /dashboard-stats` - Get summary statistics (total users, active incidents, resolved incidents).

### Users
- `GET /tourists` - Get all registered users/tourists.
