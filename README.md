# backend_spotifyclone

Backend API for a Spotify-style clone.

## Features

- Express server with JSON, file uploads, and centralized error handling
- Clerk auth middleware and admin guard
- MongoDB via Mongoose
- Cloudinary for media uploads
- Basic routes for users, auth, admin, songs, albums, and stats

## Setup

1) Install dependencies

```bash
cd backend
npm install
```

2) Create environment file

```bash
cp .env.example .env
```

Fill in the required values in `.env`.

## Environment Variables

Use the following keys in `.env`. Do not commit real secrets to git.

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>
PORT=3000
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
ADMIN_EMAIL=admin@example.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3) Run in development

```bash
npm run dev
```

## API Routes (base)

- /api/users
- /api/auth
- /api/admin
- /api/songs
- /api/albums
- /api/stats