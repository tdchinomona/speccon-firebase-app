# SpecCon Cash Reporting System - Firebase Version

A modern, cloud-based cash position reporting system built with React and Firebase.

## Features

- 🔐 Firebase Authentication (email/password)
- 🗄️ Cloud Firestore database (real-time)
- 📊 Interactive dashboard with charts
- 💼 Multi-company support (SpecCon, Megro, Infinity, Andebe, TAP)
- 📱 Fully responsive design
- 🎨 SpecCon branding
- ⚡ Real-time data synchronization
- 🚀 One-command deployment

## Tech Stack

- **Frontend:** React 18.2.0, Tailwind CSS 3.3.6, Recharts 2.10.3
- **Backend:** Firebase 10.7.1 (Authentication + Firestore)
- **Hosting:** Vercel / Firebase Hosting
- **State Management:** React Context API
- **Routing:** React Router DOM 6.20.1
- **Date Handling:** date-fns 3.0.6

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Copy the example environment file:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Then edit `.env` and add your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Get these values from Firebase Console → Project Settings → Your apps → Web app config.

### 3. Deploy Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules
```

### 4. Start Development Server
```bash
npm start
```

Visit http://localhost:3000

## Documentation

- **START_HERE.md** - Quick start guide
- **FIREBASE_SETUP.md** - Complete setup instructions

## Default Login

After setting up Firebase and creating the admin user (see FIREBASE_SETUP.md):

- Email: `admin@speccon.com`
- Password: `admin123`

⚠️ **Change this password immediately after first login!**

## Project Structure

```
src/
├── App.js                 # Main app component
├── firebase.js            # Firebase initialization
├── contexts/
│   └── AuthContext.js     # Authentication logic
├── services/
│   └── firebaseService.js # Database operations
├── components/
│   └── Layout.js          # Navigation bar
└── pages/
    ├── Login.js           # Login page
    └── Dashboard.js       # Main dashboard
```

## Deployment

### Vercel
```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git push

# Then deploy via Vercel dashboard
# Add environment variables from .env
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## Features in Detail

### Authentication
- Email/password login
- Secure JWT tokens
- Role-based access (admin/user)
- Session persistence

### Dashboard
- Cash position summary cards
- Interactive charts (Recharts)
- Company breakdown table
- Date selection
- Real-time updates

### Database Structure
- **users** - User profiles
- **companies** - Company information
- **accountTypes** - Account type definitions
- **cashPositions** - Financial data
- **auditLog** - Action history

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| REACT_APP_FIREBASE_API_KEY | Firebase API key |
| REACT_APP_FIREBASE_AUTH_DOMAIN | Firebase auth domain |
| REACT_APP_FIREBASE_PROJECT_ID | Firebase project ID |
| REACT_APP_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| REACT_APP_FIREBASE_APP_ID | Firebase app ID |

## Security

- Firestore security rules enforce authentication
- Role-based access control
- Secure Firebase configuration
- HTTPS only in production

## License

MIT

## Support

For questions or issues, please refer to the documentation files:
- START_HERE.md
- FIREBASE_SETUP.md
