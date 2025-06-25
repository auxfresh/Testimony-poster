# TestimonyShot

## Overview

TestimonyShot is a full-stack web application that allows users to create stunning testimonial graphics from customer feedback. Users can import testimonials from social media platforms, customize them with their brand styling, and export them in various formats optimized for different social media platforms.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React-based SPA with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React SPA**: Modern React application with TypeScript support
- **Component Library**: shadcn/ui components for consistent UI design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for API state, local React state for UI state
- **Canvas API**: HTML5 Canvas for dynamic testimonial image generation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Express Server**: RESTful API server with TypeScript
- **Route Handling**: Modular route system for testimonial CRUD operations
- **Storage Layer**: Abstracted storage interface supporting both memory and database storage
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Testimonials Table**: Stores testimonial content, customer information, styling preferences, and metadata
- **Schema Management**: Drizzle ORM with PostgreSQL dialect
- **Type Safety**: Generated TypeScript types from database schema

## Data Flow

1. **Content Input**: Users can input testimonials via three methods:
   - Manual text input
   - Social media URL parsing (planned feature)
   - Image upload (planned feature)

2. **Customization**: Users customize testimonials with:
   - Avatar selection (preset or custom upload)
   - Theme and color customization
   - Font family selection
   - Background type configuration

3. **Preview**: Real-time preview of testimonial cards with applied styling

4. **Export**: Generate and download testimonial images in various formats:
   - Multiple aspect ratios (Twitter, Instagram, LinkedIn, Custom)
   - Configurable dimensions and quality
   - Watermark options

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full TypeScript support across frontend and backend
- **Vite**: Modern build tool with HMR and optimized production builds

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Utility for creating component variants

### Backend Dependencies
- **Express.js**: Web framework for Node.js
- **Drizzle ORM**: Type-safe ORM for database operations
- **Neon Database**: Serverless PostgreSQL database
- **Zod**: Runtime type validation

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development

## Deployment Strategy

The application is configured for deployment on Replit's autoscale platform:

- **Build Process**: 
  - Frontend: Vite builds optimized production bundle
  - Backend: ESBuild bundles server code with external dependencies
- **Runtime**: Node.js 20 with PostgreSQL 16 module
- **Environment**: Production/development mode switching via NODE_ENV
- **Port Configuration**: Server runs on port 5000, mapped to external port 80
- **Database**: Uses DATABASE_URL environment variable for PostgreSQL connection

### Development Workflow
- **Dev Server**: Concurrent frontend (Vite) and backend (Express) development servers
- **Hot Reload**: Vite HMR for frontend, TSX watch mode for backend
- **Database Migrations**: Drizzle Kit for schema management

## Recent Changes

- June 25, 2025: Added interactive tutorial system for first-time users
  - Tutorial overlay with step-by-step guidance through the creation process
  - Highlights key UI elements during tutorial
  - Local storage to track tutorial completion
  - Tutorial restart option in header
  - Tutorial covers all major features: input methods, customization, preview, export

- June 25, 2025: Prepared application for Netlify deployment
  - Created netlify.toml configuration for build and redirects
  - Converted server routes to Netlify functions
  - Added serverless-http adapter for Express app
  - Optimized Vite build configuration with code splitting
  - Created production-ready package.json scripts
  - Added comprehensive README with deployment instructions

## Changelog

- June 25, 2025: Initial setup with complete testimonial generator
- June 25, 2025: Added tutorial system for user onboarding

## User Preferences

Preferred communication style: Simple, everyday language.