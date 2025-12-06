# JAMB CBT Practice Platform

A modern, fully-functional Computer-Based Testing (CBT) application for JAMB UTME preparation, built with React and powered by the ALOC API.

## Overview

This application provides a TestDriller-style CBT experience with smooth animations, modern UI, and comprehensive exam simulation features. It focuses exclusively on JAMB (Joint Admissions and Matriculation Board) exam preparation.

## Features

### Dashboard
- JAMB-only subjects display with 15+ subjects available
- Quick stats (practice sessions, exams taken, average score)
- Start Practice and Full Exam Mode action cards
- Recent activity tracking

### Practice Mode
- Select any single JAMB subject
- Choose specific year or random questions
- Configurable question count (10-50 questions)
- Optional timer with customizable duration
- Unlimited attempts

### Full Exam Mode (JAMB Style)
- 4 subjects total (English is compulsory)
- English: 60 questions
- Other 3 subjects: 40 questions each
- Total: 180 questions
- 2-hour duration (120 minutes)
- Subject tabs for easy navigation
- Question grid with color-coded status
- Mark for review functionality
- Auto-submit when time ends

### Exam Interface
- Timer display at the top
- Large, readable fonts
- Next/Previous navigation
- Question navigator grid
- Keyboard-friendly design
- Supports images and diagrams

### Results System
- Overall score with visual indicator
- Correct/Wrong/Unanswered breakdown
- Subject-wise performance analysis
- Time taken analysis

### Review Mode
- Filter by all/correct/wrong/unanswered
- Shows user answer vs correct answer
- Explanations when available
- Navigation between questions

### Analytics
- Score progress over time
- Subject performance comparison
- Session distribution (practice vs full exam)
- Historical data visualization

### Settings
- Light/Dark theme toggle
- Font size options
- Timer on/off toggle
- Sound and vibration settings
- Data management (clear all data)

## Technical Stack

- **Frontend:** React 19 with Vite 7
- **Styling:** Tailwind CSS v4 with custom glassmorphism effects
- **State Management:** Zustand with persistence
- **Routing:** React Router v7
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API:** ALOC Questions API

## Project Structure

```
/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Layout.jsx   # Main layout wrapper
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── PracticeSetup.jsx
│   │   ├── ExamSetup.jsx
│   │   ├── Exam.jsx
│   │   ├── Results.jsx
│   │   ├── Review.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── services/        # API services
│   │   └── api.js       # ALOC API wrapper
│   ├── store/           # State management
│   │   └── useStore.js  # Zustand store
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with custom effects
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## Running the Application

The development server runs on port 5000:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## API Reference

The app uses the ALOC Questions API:
- Documentation: https://questions.aloc.com.ng
- API Base: https://questions.aloc.com.ng/api/v2

## User Preferences

Settings are persisted locally using localStorage:
- Theme preference (light/dark)
- Font size setting
- Timer enabled/disabled
- Sound and vibration preferences
- Practice and exam history

## Design Features

- Beautiful gradient backgrounds with animated effects
- Glassmorphism card designs with backdrop blur
- Smooth hover and transition animations
- Responsive design for all devices
- Custom scrollbar styling
- Dark mode support with seamless transitions
