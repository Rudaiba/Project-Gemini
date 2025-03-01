# Project Gemini

A real-time interactive interface for Google's Gemini 2.0 AI model with audio and video capabilities.

## Overview

Hey, so I built this full-stack application that gives you a modern way to interact with Google's Gemini 2.0 AI model. It supports talking to the AI in real-time and showing it things through video, making the whole experience feel much more natural and immersive.

## Features

- 🎙️ **Real-time Audio Conversations**: You can actually talk to Gemini and hear it respond back
- 📹 **Video Input Support**: Show Gemini what you're looking at and it can understand visual stuff
- 💬 **Text Chat Interface**: Still works with traditional typing if you prefer
- 🎛️ **Customizable Settings**: You can change how Gemini behaves and sounds
- 🌓 **Dark/Light Mode**: Switch between themes based on what looks better to you

## Project Structure

I organized everything into three main parts:

### Frontend (Next.js)

I built a modern React app using Next.js, Tailwind CSS, and some custom UI components.

```
frontend/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/           # UI components
│   └── ...           # Feature components
├── lib/              # Utility functions
└── public/           # Static assets
```

### Backend (FastAPI)

I created a Python FastAPI server that handles all the WebSocket connections to the Gemini API.

```
backend/
├── main.py           # Main FastAPI application
└── requirements.txt  # Python dependencies
```

### Standalone

I also added some additional standalone components and utilities.

## Technologies I Used

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- WebSockets for real-time communication

### Backend
- FastAPI
- WebSockets
- Google Gemini API
- Python 3.x

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8 or higher
- Google Gemini API key

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Rudaiba/Project-Gemini.git
   cd Project-Gemini
   ```
2. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`

## Usage
1. Open the application in your browser
2. Click the microphone button to start an audio conversation
3. Click the camera button to enable video input
4. Type in the text input for text-based interaction
5. Use the settings panel to customize your experience

## Acknowledgments
- Google Gemini API for providing the AI capabilities
- The Next.js and FastAPI communities for their excellent frameworks