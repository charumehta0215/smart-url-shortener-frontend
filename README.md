# SmartShort

Intelligent URL shortening and link management platform for modern marketing teams.

## Features

- 🔗 URL shortening with custom slugs
- 📊 Real-time click tracking and analytics
- 🌍 Geolocation-based traffic insights
- 🤖 AI-powered analytics summaries
- 🔐 User authentication and link management
- 📱 QR code generation
- 🎨 Dark/light theme support

## Tech Stack

### Frontend
- **React 19** with TypeScript/JSX
- **Vite 7** - Build tool
- **Tailwind CSS v4** - Styling
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations

### Backend
- **Node.js** with Express
- **PostgreSQL** with Drizzle ORM
- **Passport.js** - Authentication
- **TypeScript** - Type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smartshort
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Push database schema
```bash
npm run db:push
```

### Development

Start the backend server:
```bash
npm run dev
```

Start the frontend dev server (in another terminal):
```bash
npm run dev:client
```

The app will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI primitives
│   ├── layout.tsx   # Main app layout
│   └── theme-toggle.tsx
├── pages/           # Route-level pages
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configs
│   ├── api.ts       # API service layer
│   ├── utils.ts     # Helper functions
│   └── queryClient.ts
├── App.jsx          # Root component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Available Scripts

- `npm run dev` - Start backend server
- `npm run dev:client` - Start frontend dev server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## License

MIT
