# video-call-ai-meeting-assistance
# Video Meeting AI Assistant

A cross-platform video meeting application with integrated AI assistant that combines dataset lookup with LLM fallback capabilities.

## Features

### 🎥 Video Calling
- WebRTC-based video calls using Daily.co
- Person-to-person video meetings
- Audio/video controls and participant management
- Professional meeting interface

### 🤖 AI Assistant
- **Dataset-First Approach**: Checks predefined FAQ database first
- **LLM Fallback**: Uses OpenAI GPT-4o-mini for complex queries
- **Voice Input**: Whisper-powered speech-to-text transcription
- **Smart Responses**: Formatted answers with code blocks and bullet points
- **Source Indicators**: Shows whether answer came from dataset or AI

### 💾 Data Management
- **Conversation Memory**: Stores all Q&A exchanges in Supabase
- **Meeting Summaries**: AI-generated summaries at session end
- **Session Tracking**: Maintains context throughout meetings
- **FAQ Database**: Predefined answers for common questions

### 🎨 User Experience
- **Split-Screen Layout**: Video call on left, AI chat on right
- **Real-time Chat**: Instant responses with typing indicators
- **Voice Recording**: Click-to-record audio questions
- **Professional Design**: Clean, modern interface optimized for productivity

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Daily.co** for video calling
- **Supabase** client for database
- **Lucide React** for icons

### Backend
- **Python FastAPI** for ML processing
- **OpenAI Whisper** for speech-to-text
- **OpenAI GPT-4o-mini** for intelligent responses
- **Supabase** for database and real-time features

### Database
- **Supabase PostgreSQL** with:
  - FAQ table for predefined Q&A
  - Conversations table for session history
  - Meeting summaries table for generated summaries

## Setup Instructions

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your environment variables to .env:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_DAILY_API_KEY=your_daily_api_key
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Add your environment variables to .env:
# OPENAI_API_KEY=your_openai_api_key
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Start the server
python main.py
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the migration file in the Supabase SQL editor:
   ```sql
   -- Copy and paste contents of supabase/migrations/create_video_meeting_schema.sql
   ```
3. The migration will create all necessary tables and sample data

### 4. External Services

#### Daily.co Setup
1. Sign up at [Daily.co](https://daily.co)
2. Get your API key from the dashboard
3. Add it to your frontend `.env` file

#### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your backend `.env` file
3. Ensure you have credits for GPT-4o-mini and Whisper usage

## Usage

1. **Start a Meeting**: Click "Start Video Call" to begin
2. **Ask Questions**: Type or use voice recording to ask the AI assistant
3. **Get Answers**: Receive responses from dataset or AI with source indicators
4. **Generate Summary**: Click "Generate Meeting Summary" when done
5. **Review History**: All conversations are saved and can be reviewed

## API Endpoints

### Backend API (`http://localhost:8000`)

- `POST /ask` - Process text questions
- `POST /transcribe` - Transcribe audio to text
- `POST /summary` - Generate meeting summary
- `GET /health` - Health check

## Database Schema

### Tables

1. **faq** - Predefined Q&A dataset
   - question, answer, category, timestamps

2. **conversations** - Session Q&A history
   - session_id, question, answer, source, timestamps

3. **meeting_summaries** - Generated summaries
   - session_id, summary, metrics, key_topics, timestamps

## Development

### Adding FAQ Entries

```sql
INSERT INTO faq (question, answer, category) VALUES (
  'Your question here',
  'Your formatted answer with • bullet points and ```code blocks```',
  'Category'
);
```

### Customizing AI Responses

Edit the system prompt in `backend/main.py` in the `generate_llm_response` function to adjust the AI's behavior and response style.

### Extending Video Features

The video calling functionality uses Daily.co's JavaScript SDK. Refer to their [documentation](https://docs.daily.co) for advanced features like screen sharing, recording, etc.

## Production Deployment

### Frontend
- Deploy to Vercel, Netlify, or similar
- Update CORS settings in backend for your domain

### Backend
- Deploy to Railway, Render, or similar Python hosting
- Set environment variables in your hosting platform
- Update frontend API_URL to your deployed backend

### Database
- Supabase handles scaling automatically
- Consider upgrading plan for higher usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
