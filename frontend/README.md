# CelebNetwork Frontend

This is the frontend application for CelebNetwork, a celebrity discovery and fan engagement platform.

## Features

- AI-powered celebrity search and discovery
- Fan authentication and profile management
- Celebrity following system
- Real-time updates and notifications
- PDF profile generation
- Responsive and modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Context for state management
- JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # App Router pages
├── components/          # Reusable components
├── contexts/           # React Context providers
└── types/             # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT 