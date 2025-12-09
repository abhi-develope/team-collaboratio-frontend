# Team Collaboration Platform - Frontend

A modern, responsive React-based frontend for the team collaboration platform with real-time features and intuitive user interface.

## Overview

This frontend application provides a comprehensive interface for team collaboration, enabling users to manage projects, track tasks, communicate in real-time, and coordinate with team members. Built with React, TypeScript, and Tailwind CSS for a seamless user experience.

## Features

- **Authentication System**: Secure login and registration with JWT
- **Real-time Messaging**: Instant chat with team members using Socket.io
- **Project Management**: Create, view, and manage collaborative projects
- **Task Management**: Organize tasks with drag-and-drop support
- **Team Collaboration**: Manage teams and member roles
- **Dashboard**: Overview of projects, tasks, and team activity
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Theme switching support
- **Protected Routes**: Role-based access control

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **Notifications**: React Hot Toast
- **Drag & Drop**: @hello-pangea/dnd
- **Date Handling**: date-fns
- **Backend Integration**: Firebase (optional)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-collaboration-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your backend URL (see [Environment Variables](#environment-variables) section)

## Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for reference:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `your-api-key` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR). The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist` directory.

### Preview Production Build
```bash
npm preview
```
Locally preview the production build.

## Project Structure

```
src/
├── App.tsx                 # Main App component
├── main.tsx                # Application entry point
├── index.css               # Global styles
├── types.ts                # TypeScript type definitions
├── assets/                 # Static assets
├── components/             # Reusable UI components
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Dropdown.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── Select.tsx
│   └── Sidebar.tsx
├── context/                # React Context for state
│   ├── AuthContext.tsx     # Authentication context
│   └── ThemeContext.tsx    # Theme context
├── pages/                  # Page components
│   ├── Chat.tsx            # Real-time messaging
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Login.tsx           # Login page
│   ├── Projects.tsx        # Projects management
│   ├── Register.tsx        # Registration page
│   ├── Tasks.tsx           # Task management with drag-drop
│   └── Team.tsx            # Team management
├── services/               # API and service layer
│   ├── api.ts              # Axios instance and HTTP calls
│   ├── firebase.ts         # Firebase configuration
│   └── socket.ts           # Socket.io client setup
├── utils/                  # Utility functions
│   ├── constants.ts        # App constants
│   └── helpers.ts          # Helper functions
└── env.d.ts                # Environment variable type definitions
```

## Component Usage

### Key Components

#### Button
```tsx
<Button onClick={handleClick} variant="primary">
  Click Me
</Button>
```

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={closeModal}>
  <p>Modal content here</p>
</Modal>
```

#### Input
```tsx
<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

#### Card
```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>
```

## Pages Overview

### Login & Register
Authentication pages for user login and account creation.

### Dashboard
Central hub showing:
- Recent projects
- Upcoming tasks
- Team activity
- Quick stats

### Projects
- List all projects
- Create new projects
- View project details
- Manage project members

### Tasks
- Display tasks in kanban board
- Drag-and-drop to change status
- Create and edit tasks
- Filter and search

### Team
- View team members
- Manage team roles
- Add/remove members
- Team settings

### Chat
- Real-time messaging
- Message history
- User presence indicators
- Typing notifications

## API Integration

The `api.ts` service provides:
- Axios instance with base URL
- Request/response interceptors
- Error handling
- Authentication token management

Example usage:
```tsx
import { api } from '../services/api';

const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};
```

## Real-time Features

Socket.io integration for:
- Instant message updates
- Task status changes
- Project updates
- User presence
- Typing indicators

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for all requests
5. Protected routes validate token
6. Auto-logout on token expiration

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling with custom configuration in `tailwind.config.js`. Custom components follow a consistent design system.

## Building and Deployment

### Build
```bash
npm run build
```

### Deploy to Static Hosting
- **Vercel**: Connect GitHub repo to Vercel
- **Netlify**: Drag and drop `dist` folder or connect GitHub
- **GitHub Pages**: Use GitHub Actions to deploy
- **AWS S3 + CloudFront**: Upload `dist` to S3
- **Azure Static Web Apps**: Deploy from GitHub

### Environment Variables in Production
Set production environment variables in your hosting platform's configuration.

## Troubleshooting

### Backend Connection Failed
- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env.local`
- Ensure CORS is configured correctly on backend

### Hot Module Replacement (HMR) Not Working
- Clear browser cache
- Restart dev server
- Check Vite configuration

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Socket.io Connection Issues
- Verify backend Socket.io server is running
- Check `VITE_SOCKET_URL` environment variable
- Ensure WebSocket is not blocked by firewall

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Image optimization
- CSS purging via Tailwind
- Production build optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.
