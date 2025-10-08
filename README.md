# Initiative Forge

A web application designed as a command center for Dungeons & Dragons 5e Game Masters to streamline campaign management and combat encounters.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Overview

Initiative Forge addresses the common challenges faced by D&D 5e Game Masters, particularly beginners, by providing a centralized digital environment for managing campaigns and running combat encounters. The application eliminates the need to juggle multiple rulebooks and notes during sessions by offering:

- **Global Monster Library** - Searchable database of creatures with SRD stats
- **Global Spell Library** - Comprehensive spell reference with filtering by level and class
- **Campaign Management** - Organize player characters and encounters for each campaign
- **Combat Tracker** - Real-time initiative tracking, HP management, action resolution, and condition monitoring
- **Automated Rolls** - Instant attack rolls, damage calculations, and initiative with advantage/disadvantage support

The goal is to make combat rounds faster and more fluid, allowing DMs to focus on storytelling rather than rulebook management.

## Tech Stack

### Frontend

- **[Astro 5](https://astro.build/)** - Modern web framework optimized for content-rich websites with SSR support
- **[React 19](https://react.dev/)** - UI library for interactive components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Static type checking and enhanced IDE support
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[Shadcn/ui](https://ui.shadcn.com/)** - Accessible component library built on Radix UI
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management for combat encounters

### Backend

- **[Supabase](https://supabase.com/)** - Open-source backend-as-a-service providing:
  - PostgreSQL database
  - Built-in authentication
  - Real-time subscriptions
  - RESTful API

### Development & Deployment

- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code linting and formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for automated checks
- **GitHub Actions** - CI/CD pipeline automation
- **Vercel / Cloudflare** - Deployment and hosting

## Getting Started

### Prerequisites

- **Node.js**: v22.14.0 (use [nvm](https://github.com/nvm-sh/nvm) for version management)
- **npm**: Comes with Node.js
- **Supabase Account**: Required for backend services (sign up at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd initiative-forge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root with your Supabase credentials:

   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- **`npm run dev`** - Start development server with hot module replacement on port 3000
- **`npm run build`** - Create optimized production build
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Check code for linting errors
- **`npm run lint:fix`** - Automatically fix linting issues
- **`npm run format`** - Format code with Prettier

## Project Scope

### MVP Features (In Scope)

**User Management**

- Email and password authentication
- Account creation and login

**Campaign Management**

- Create and manage campaigns
- Add simplified player character cards with:
  - Name, HP, AC, Speed
  - Six core attributes (STR, DEX, CON, INT, WIS, CHA)
  - Auto-calculated initiative modifier and passive perception

**Global Libraries**

- Monster library with search and CR filtering (SRD data)
- Spell library with search, level, and class filtering (SRD data)

**Combat Module**

- Create encounters within campaigns
- Add player characters, monsters (multiple instances), and NPCs
- Automatic initiative rolling and sorting
- Turn-by-turn tracking with active character highlighting
- One-click action execution with automatic attack and damage rolls
- Advantage/disadvantage roll mechanics
- HP tracking (damage and healing)
- Condition management with rule descriptions

### Out of Scope (MVP)

- Magic items library
- Advanced session journaling (plot notes, world details, NPC records)
- Auto-save combat state after each turn
- Full character sheets (inventory, skills, backstory, etc.)

## Project Status

**Current Version**: 0.0.1 (Early Development)

Initiative Forge is in active development. The MVP is being built to validate core functionality, focusing on delivering a seamless combat management experience for D&D 5e Game Masters.

**Success Criteria**:

- Complete combat scenarios can be conducted smoothly from start to finish
- Average combat round duration (4 players + 3 monsters) takes less than 10 minutes

## License

This project does not currently have a specified license. Please contact the repository owner for usage and distribution terms.

### D&D Content Attribution

This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

Initiative Forge is compatible with fifth edition.
