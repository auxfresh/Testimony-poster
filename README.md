# TestimonyShot

A modern web application for creating professional testimonial graphics from customer feedback.

## Features

- **Social Media Import**: Import testimonials from Twitter/X, LinkedIn, Facebook, Instagram, and more
- **Customization**: Brand colors, fonts, avatars, and layouts
- **Multi-Platform Export**: Perfect dimensions for all social media platforms
- **Live Preview**: Real-time design updates
- **HD Quality**: High-resolution PNG exports
- **Interactive Tutorial**: Guided onboarding for new users

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build command to: `npm run build`
3. Set publish directory to: `client/dist`
4. Deploy!

The application is configured with:
- Automatic redirects for SPA routing
- Serverless functions for API endpoints
- Optimized builds with code splitting

### Environment Variables

For production deployment, you may want to set:
- `VITE_API_BASE_URL`: Base URL for API calls (optional)

## Architecture

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **Backend**: Express.js (serverless functions for deployment)
- **Canvas API**: HTML5 Canvas for image generation

## Project Structure

```
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend API
├── shared/              # Shared schemas and types
├── netlify/             # Netlify functions
└── components.json      # shadcn/ui configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details